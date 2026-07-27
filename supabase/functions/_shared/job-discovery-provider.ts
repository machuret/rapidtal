import {
  isApifyRunPending,
  parseApifyRun,
} from "./apify.ts";
import {
  buildDiscoveryActorInput,
  discoveryAccessBarrier,
  isCompleteDiscoverySnapshot,
  isPublicDiscoveryActorInput,
  normalizeDiscoveryDataset,
  type DiscoveryParameters,
  type JobDiscoverySource,
  type NormalizedDiscovery,
} from "./job-discovery.ts";
import {
  abortApifyProviderRun,
  fetchWithLinearRetry,
} from "./provider-http.ts";

type ProviderFetcher = (
  url: string,
  init: RequestInit,
  timeoutMs: number,
  attempts?: number,
) => Promise<Response>;

type DiscoveryProviderDependencies = {
  fetcher?: ProviderFetcher;
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
  aborter?: (runId: string, authorization: string) => Promise<void>;
  onRunStarted?: (runId: string) => Promise<void>;
};

export type DiscoveryProviderResult = {
  providerRunId: string;
  providerCostUsd: number;
  discoveries: NormalizedDiscovery[];
  completeSnapshot: boolean;
};

export class DiscoveryProviderError extends Error {
  responseStatus: number;
  publicMessage: string;
  code: string;
  retryAfterSeconds: number | null;
  providerRunId: string | null;

  constructor(options: {
    responseStatus: number;
    publicMessage: string;
    code: string;
    internalMessage?: string;
    retryAfterSeconds?: number | null;
    providerRunId?: string | null;
  }) {
    super(options.internalMessage ?? options.publicMessage);
    this.name = "DiscoveryProviderError";
    this.responseStatus = options.responseStatus;
    this.publicMessage = options.publicMessage;
    this.code = options.code;
    this.retryAfterSeconds = options.retryAfterSeconds ?? null;
    this.providerRunId = options.providerRunId ?? null;
  }
}

export async function discoverJobsWithApify(
  options: {
    actor: string;
    apiKey: string;
    source: JobDiscoverySource;
    parameters: DiscoveryParameters;
    maxChargeUsd: number;
  },
  dependencies: DiscoveryProviderDependencies = {},
): Promise<DiscoveryProviderResult> {
  if (!/^[a-zA-Z0-9_-]+~[a-zA-Z0-9_-]+$/.test(options.actor)) {
    throw new DiscoveryProviderError({
      responseStatus: 503,
      publicMessage: "Job discovery provider is misconfigured.",
      code: "provider_config",
    });
  }

  const actorInput = buildDiscoveryActorInput(
    options.source,
    options.parameters,
  );
  if (!isPublicDiscoveryActorInput(actorInput)) {
    throw new DiscoveryProviderError({
      responseStatus: 500,
      publicMessage: "The source adapter violated the public-only policy.",
      code: "adapter_credentials_forbidden",
    });
  }

  const fetcher = dependencies.fetcher ?? fetchWithLinearRetry;
  const now = dependencies.now ?? Date.now;
  const sleep = dependencies.sleep
    ?? ((milliseconds) =>
      new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
  const aborter = dependencies.aborter ?? abortApifyProviderRun;
  const authorization = `Bearer ${options.apiKey}`;
  const maxResults = options.parameters.maxResults;

  const startResponse = await fetcher(
    `https://api.apify.com/v2/acts/${options.actor}/runs?timeout=120&maxItems=${maxResults}&maxTotalChargeUsd=${options.maxChargeUsd}`,
    {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actorInput),
    },
    20_000,
  );
  const startPayload = await startResponse.json().catch(() => null);
  let run = parseApifyRun(startPayload);
  if (!startResponse.ok || !run) {
    const retryAfter = Number(startResponse.headers.get("Retry-After"));
    throw new DiscoveryProviderError({
      responseStatus: 502,
      publicMessage: "The job search could not be started.",
      code: "provider_start_failed",
      internalMessage: `Apify returned HTTP ${startResponse.status}.`,
      retryAfterSeconds: Number.isFinite(retryAfter) ? retryAfter : null,
    });
  }
  await dependencies.onRunStarted?.(run.id);

  const deadline = now() + 110_000;
  while (isApifyRunPending(run.status) && now() < deadline) {
    await sleep(3_000);
    const statusResponse = await fetcher(
      `https://api.apify.com/v2/actor-runs/${run.id}`,
      { headers: { Authorization: authorization } },
      10_000,
    );
    const nextRun = parseApifyRun(
      await statusResponse.json().catch(() => null),
    );
    if (!statusResponse.ok || !nextRun) {
      await aborter(run.id, authorization);
      throw new DiscoveryProviderError({
        responseStatus: 502,
        publicMessage: "The job search status could not be read.",
        code: "provider_status_failed",
        providerRunId: run.id,
      });
    }
    run = nextRun;
  }
  if (isApifyRunPending(run.status)) {
    await aborter(run.id, authorization);
    throw new DiscoveryProviderError({
      responseStatus: 504,
      publicMessage: "The job search took too long.",
      code: "provider_timeout",
      providerRunId: run.id,
    });
  }
  if (run.status !== "SUCCEEDED" || !run.defaultDatasetId) {
    throw new DiscoveryProviderError({
      responseStatus: 502,
      publicMessage: "The job search did not complete.",
      code: "provider_run_failed",
      internalMessage: `Apify finished with status ${run.status}.`,
      providerRunId: run.id,
    });
  }

  const datasetResponse = await fetcher(
    `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?clean=true&limit=${maxResults}`,
    { headers: { Authorization: authorization } },
    15_000,
  );
  const dataset = await datasetResponse.json().catch(() => null);
  if (!datasetResponse.ok) {
    throw new DiscoveryProviderError({
      responseStatus: 502,
      publicMessage: "The job search results could not be read.",
      code: "dataset_failed",
      providerRunId: run.id,
    });
  }

  const accessBarrier = discoveryAccessBarrier(dataset);
  if (accessBarrier) {
    throw new DiscoveryProviderError({
      responseStatus: 409,
      publicMessage:
        "The source requested authentication or human verification. Automation stopped.",
      code: "source_access_blocked",
      internalMessage: `Public-only adapter stopped on ${accessBarrier}.`,
      retryAfterSeconds: 86_400,
      providerRunId: run.id,
    });
  }

  const discoveries = normalizeDiscoveryDataset(
    options.source,
    dataset,
    options.parameters.country,
    maxResults,
  );
  return {
    providerRunId: run.id,
    providerCostUsd: run.usageTotalUsd,
    discoveries,
    completeSnapshot: isCompleteDiscoverySnapshot(
      dataset,
      discoveries.length,
      maxResults,
    ),
  };
}
