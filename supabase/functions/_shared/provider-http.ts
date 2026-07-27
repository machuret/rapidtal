type ProviderHttpDependencies = {
  fetcher?: typeof fetch;
  sleep?: (milliseconds: number) => Promise<void>;
};

function isRetryable(response: Response): boolean {
  return response.status === 429 || response.status >= 500;
}

function defaultSleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function retryAfterDelay(response: Response | null, fallback: number): number {
  const retryAfter = Number(response?.headers.get("Retry-After"));
  return Number.isFinite(retryAfter) && retryAfter > 0
    ? Math.min(retryAfter * 1000, 3_000)
    : fallback;
}

export async function fetchWithLinearRetry(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  attempts = 2,
  dependencies: ProviderHttpDependencies = {},
): Promise<Response> {
  const fetcher = dependencies.fetcher ?? fetch;
  const sleep = dependencies.sleep ?? defaultSleep;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let response: Response | null = null;
    try {
      response = await fetcher(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!isRetryable(response) || attempt === attempts) return response;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }
    await sleep(retryAfterDelay(response, 500 * attempt));
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Provider request failed.");
}

export async function fetchWithExponentialRetry(
  url: string,
  init: RequestInit,
  attempts = 3,
  timeoutMs = 45_000,
  dependencies: ProviderHttpDependencies = {},
): Promise<Response> {
  const fetcher = dependencies.fetcher ?? fetch;
  const sleep = dependencies.sleep ?? defaultSleep;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetcher(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!isRetryable(response)) return response;
      lastError = new Error(`Provider returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt + 1 < attempts) {
      await sleep(750 * (2 ** attempt));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Provider request failed.");
}

export async function abortApifyProviderRun(
  runId: string,
  authorization: string,
  fetcher: (
    url: string,
    init: RequestInit,
    timeoutMs: number,
    attempts: number,
  ) => Promise<Response> = fetchWithLinearRetry,
): Promise<void> {
  await fetcher(
    `https://api.apify.com/v2/actor-runs/${runId}/abort`,
    { method: "POST", headers: { Authorization: authorization } },
    10_000,
    1,
  );
}
