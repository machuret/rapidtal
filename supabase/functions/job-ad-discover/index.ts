/**
 * Phase 2 job discovery:
 * authenticated saved search -> Apify actor -> normalized discovery queue.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.1";
import { isApifyRunPending, parseApifyRun } from "../_shared/apify.ts";
import {
  actorForSource,
  buildDiscoveryActorInput,
  normalizeDiscoveryDataset,
  type DiscoveryParameters,
  type JobDiscoverySource,
} from "../_shared/job-discovery.ts";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;
const SOURCES = new Set<JobDiscoverySource>(["seek", "indeed", "linkedin"]);

function response(payload: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  attempts = 2,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let result: Response | null = null;
    try {
      result = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (result.status !== 429 && result.status < 500) return result;
      if (attempt === attempts) return result;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }
    const retryAfter = Number(result?.headers.get("Retry-After"));
    await new Promise((resolve) =>
      setTimeout(resolve, Number.isFinite(retryAfter) ? Math.min(retryAfter * 1000, 3000) : 500 * attempt)
    );
  }
  throw lastError instanceof Error ? lastError : new Error("Provider request failed.");
}

async function abortRun(runId: string, authorization: string): Promise<void> {
  try {
    await fetchWithRetry(
      `https://api.apify.com/v2/actor-runs/${runId}/abort`,
      { method: "POST", headers: { Authorization: authorization } },
      10_000,
      1,
    );
  } catch (error) {
    console.error("job-ad-discover Apify abort:", error);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "Method not allowed." }, 405);

  const startedAt = Date.now();
  let runId: string | null = null;
  let admin: ReturnType<typeof createClient> | null = null;

  async function fail(
    status: number,
    message: string,
    code: string,
    internalMessage = message,
  ): Promise<Response> {
    if (admin && runId) {
      const { error } = await admin.from("job_discovery_runs").update({
        status: "failed",
        error_code: code.slice(0, 100),
        error_message: internalMessage.slice(0, 1000),
        duration_ms: Date.now() - startedAt,
        completed_at: new Date().toISOString(),
      }).eq("id", runId);
      if (error) console.error("job-ad-discover failure log:", error);
    }
    return response({ error: message, code }, status);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return response({ error: "Unauthorized." }, 401);
    const jwt = authHeader.slice("Bearer ".length);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const apifyKey = Deno.env.get("APIFY_API_KEY");
    if (!supabaseUrl || !serviceKey || !anonKey) {
      return response({ error: "Supabase function environment is incomplete." }, 503);
    }
    if (!apifyKey) return response({ error: "Job discovery is not configured." }, 503);

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });
    const { data: { user: authUser }, error: authError } = await userClient.auth.getUser();
    if (authError || !authUser) return response({ error: "Unauthorized." }, 401);

    admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: userRow, error: userError } = await admin
      .from("users").select("id, role, client_id").eq("id", authUser.id).single();
    if (userError || !userRow) return response({ error: "User record not found." }, 403);

    const parsedBody: unknown = await req.json().catch(() => null);
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      return response({ error: "Invalid JSON." }, 400);
    }
    const body = parsedBody as Record<string, unknown>;
    const clientId = typeof body.clientId === "string" ? body.clientId : "";
    const source = body.source as JobDiscoverySource;
    const searchTerm = cleanText(body.searchTerm, 120);
    const location = cleanText(body.location, 120);
    const country = cleanText(body.country, 2).toUpperCase() || "AU";
    const workType = cleanText(body.workType, 50);
    const maxResults = Math.floor(Number(body.maxResults ?? 25));
    const dateRangeDays = Math.floor(Number(body.dateRangeDays ?? 7));

    if (!UUID_RE.test(clientId) || !SOURCES.has(source) || searchTerm.length < 2) {
      return response({ error: "A valid client, source, and search term are required." }, 400);
    }
    if (
      !/^[A-Z]{2}$/.test(country)
      || !Number.isInteger(maxResults) || maxResults < 10 || maxResults > 50
      || !Number.isInteger(dateRangeDays) || dateRangeDays < 1 || dateRangeDays > 30
    ) {
      return response({ error: "Search filters are outside the supported limits." }, 400);
    }

    const role = String(userRow.role);
    if (
      !["super_admin", "client_admin"].includes(role)
      || (role !== "super_admin" && userRow.client_id !== clientId)
    ) {
      return response({ error: "Forbidden." }, 403);
    }

    const { data: allowed, error: rateError } = await admin.rpc("consume_api_rate_limit", {
      p_key: `job-ad-discover:${authUser.id}`,
      p_limit: 3,
      p_window_seconds: 600,
    });
    if (rateError) return response({ error: "Rate limiter unavailable." }, 503);
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Discovery limit reached. Try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "600" },
      });
    }

    const staleCutoff = new Date(Date.now() - 20 * 60_000).toISOString();
    await admin.from("job_discovery_runs").update({
      status: "failed",
      error_code: "stale_run",
      error_message: "The discovery worker stopped before completing.",
      completed_at: new Date().toISOString(),
    }).eq("client_id", clientId).eq("status", "running").lt("started_at", staleCutoff);

    const { data: search, error: searchError } = await admin.from("job_searches").upsert({
      client_id: clientId,
      source,
      search_term: searchTerm,
      location,
      country,
      work_type: workType,
      date_range_days: dateRangeDays,
      max_results: maxResults,
      is_active: true,
      created_by: authUser.id,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "client_id,source,search_term,location,country,work_type,date_range_days",
    }).select("id").single();
    if (searchError || !search) {
      console.error("job-ad-discover search save:", searchError);
      return response({ error: "The saved search could not be created." }, 500);
    }

    const { data: run, error: runError } = await admin.from("job_discovery_runs").insert({
      client_id: clientId,
      search_id: search.id,
      source,
      search_term: searchTerm,
      location,
      created_by: authUser.id,
    }).select("id").single();
    if (runError || !run) return response({ error: "The discovery run could not start." }, 500);
    runId = String(run.id);

    const actor = actorForSource(source, {
      seek: Deno.env.get("APIFY_SEEK_ACTOR") || undefined,
      indeed: Deno.env.get("APIFY_INDEED_ACTOR") || undefined,
      linkedin: Deno.env.get("APIFY_LINKEDIN_ACTOR") || undefined,
    });
    if (!/^[a-zA-Z0-9_-]+~[a-zA-Z0-9_-]+$/.test(actor)) {
      return await fail(503, "Job discovery provider is misconfigured.", "provider_config");
    }
    const configuredChargeCap = Number(Deno.env.get("APIFY_DISCOVERY_MAX_CHARGE_USD") ?? 1);
    const maxChargeUsd = Number.isFinite(configuredChargeCap)
        && configuredChargeCap >= 0.1
        && configuredChargeCap <= 5
      ? configuredChargeCap
      : 1;
    const params: DiscoveryParameters = {
      searchTerm, location, country, maxResults, dateRangeDays, workType,
    };
    const authorization = `Bearer ${apifyKey}`;
    const startRes = await fetchWithRetry(
      `https://api.apify.com/v2/acts/${actor}/runs?timeout=120&maxItems=${maxResults}&maxTotalChargeUsd=${maxChargeUsd}`,
      {
        method: "POST",
        headers: { Authorization: authorization, "Content-Type": "application/json" },
        body: JSON.stringify(buildDiscoveryActorInput(source, params)),
      },
      20_000,
    );
    const startJson = await startRes.json().catch(() => null);
    let providerRun = parseApifyRun(startJson);
    if (!startRes.ok || !providerRun) {
      return await fail(
        502,
        "The job search could not be started.",
        "provider_start_failed",
        `Apify returned HTTP ${startRes.status}.`,
      );
    }
    await admin.from("job_discovery_runs")
      .update({ provider_run_id: providerRun.id }).eq("id", runId);

    const deadline = Date.now() + 110_000;
    while (isApifyRunPending(providerRun.status) && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 3_000));
      const statusRes = await fetchWithRetry(
        `https://api.apify.com/v2/actor-runs/${providerRun.id}`,
        { headers: { Authorization: authorization } },
        10_000,
      );
      const nextRun = parseApifyRun(await statusRes.json().catch(() => null));
      if (!statusRes.ok || !nextRun) {
        await abortRun(providerRun.id, authorization);
        return await fail(502, "The job search status could not be read.", "provider_status_failed");
      }
      providerRun = nextRun;
    }
    if (isApifyRunPending(providerRun.status)) {
      await abortRun(providerRun.id, authorization);
      return await fail(504, "The job search took too long.", "provider_timeout");
    }
    if (providerRun.status !== "SUCCEEDED" || !providerRun.defaultDatasetId) {
      return await fail(
        502,
        "The job search did not complete.",
        "provider_run_failed",
        `Apify finished with status ${providerRun.status}.`,
      );
    }

    const datasetRes = await fetchWithRetry(
      `https://api.apify.com/v2/datasets/${providerRun.defaultDatasetId}/items?clean=true&limit=${maxResults}`,
      { headers: { Authorization: authorization } },
      15_000,
    );
    const dataset = await datasetRes.json().catch(() => null);
    if (!datasetRes.ok) {
      return await fail(502, "The job search results could not be read.", "dataset_failed");
    }
    const discoveries = normalizeDiscoveryDataset(source, dataset, country, maxResults);
    const canonicalUrls = discoveries.map((item) => item.canonical_url);
    const { data: existingRows } = canonicalUrls.length
      ? await admin.from("job_discoveries")
        .select("canonical_url, status, job_ad_id")
        .eq("client_id", clientId)
        .in("canonical_url", canonicalUrls)
      : { data: [] };
    const existing = new Map(
      (existingRows ?? []).map((item: Record<string, unknown>) => [String(item.canonical_url), item]),
    );
    const now = new Date().toISOString();
    const rows = discoveries.map((item) => {
      const previous = existing.get(item.canonical_url) as Record<string, unknown> | undefined;
      return {
        ...item,
        client_id: clientId,
        discovery_run_id: runId,
        status: previous?.status ?? "new",
        job_ad_id: previous?.job_ad_id ?? null,
        last_seen_at: now,
        updated_at: now,
      };
    });
    if (rows.length) {
      const { error: saveError } = await admin.from("job_discoveries").upsert(rows, {
        onConflict: "client_id,canonical_url",
      });
      if (saveError) {
        console.error("job-ad-discover save:", saveError);
        return await fail(500, "The discovered jobs could not be saved.", "save_failed");
      }
    }

    const newCount = discoveries.filter((item) => !existing.has(item.canonical_url)).length;
    const { error: completeError } = await admin.from("job_discovery_runs").update({
      status: "completed",
      result_count: discoveries.length,
      new_count: newCount,
      cost_usd: providerRun.usageTotalUsd,
      duration_ms: Date.now() - startedAt,
      completed_at: now,
    }).eq("id", runId);
    await admin.from("job_searches").update({ last_run_at: now }).eq("id", search.id);
    if (completeError) return response({ error: "Results saved, but run audit failed." }, 500);

    return response({
      success: true,
      count: discoveries.length,
      newCount,
      searchId: search.id,
      discoveryRunId: runId,
      providerRunId: providerRun.id,
      providerCostUsd: providerRun.usageTotalUsd,
    }, 200);
  } catch (error) {
    console.error("job-ad-discover:", error);
    return await fail(
      500,
      "Job discovery failed.",
      "internal_error",
      error instanceof Error ? error.message : "Unexpected discovery error.",
    );
  }
});
