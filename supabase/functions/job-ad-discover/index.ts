/**
 * Phase 6 job discovery:
 * manual or leased scheduled search -> compliant source adapter -> bounded
 * Apify run -> incremental discovery lifecycle.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.1";
import {
  actorForSource,
  DISCOVERY_ADAPTERS,
} from "../_shared/job-discovery.ts";
import {
  discoverJobsWithApify,
  DiscoveryProviderError,
  type DiscoveryProviderResult,
} from "../_shared/job-discovery-provider.ts";
import {
  normalizeManualDiscoveryRequest,
  normalizeScheduledDiscoveryRequest,
  validateDiscoveryRequest,
  type NormalizedDiscoveryRequest,
} from "../_shared/job-discovery-request.ts";
import {
  normalizeDiscoveryCounts,
  prepareDiscoveryCompletion,
  prepareDiscoveryRunPayload,
  prepareSavedSearchPayload,
} from "../_shared/job-discovery-persistence.ts";
import { isUuid } from "../_shared/validation.ts";

const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
type AdminClient = ReturnType<typeof createClient>;

function response(payload: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function finishSchedule(
  admin: AdminClient,
  searchId: string | null,
  leaseToken: string | null,
  succeeded: boolean,
  retryAfterSeconds: number | null = null,
): Promise<void> {
  if (!searchId || !leaseToken) return;
  const { error } = await admin.rpc("finish_job_search_schedule", {
    p_search_id: searchId,
    p_lease_token: leaseToken,
    p_succeeded: succeeded,
    p_retry_after_seconds: retryAfterSeconds,
  });
  if (error) console.error("job-ad-discover schedule finish:", error);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "Method not allowed." }, 405);

  const startedAt = Date.now();
  let runId: string | null = null;
  let admin: AdminClient | null = null;
  let scheduledSearchId: string | null = null;
  let scheduledLeaseToken: string | null = null;

  async function fail(
    status: number,
    message: string,
    code: string,
    internalMessage = message,
    retryAfterSeconds: number | null = null,
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
    if (admin) {
      await finishSchedule(
        admin,
        scheduledSearchId,
        scheduledLeaseToken,
        false,
        retryAfterSeconds,
      );
    }
    return response({ error: message, code }, status);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return response({ error: "Unauthorized." }, 401);
    }
    const jwt = authHeader.slice("Bearer ".length);
    const parsedBody: unknown = await req.json().catch(() => null);
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      return response({ error: "Invalid JSON." }, 400);
    }
    const body = parsedBody as Record<string, unknown>;
    const isScheduled = body.trigger === "scheduled";

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const apifyKey = Deno.env.get("APIFY_API_KEY");
    if (!supabaseUrl || !serviceKey || !anonKey) {
      return response({ error: "Supabase function environment is incomplete." }, 503);
    }
    if (!apifyKey) return response({ error: "Job discovery is not configured." }, 503);

    admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let discoveryRequest: NormalizedDiscoveryRequest;
    if (isScheduled) {
      if (jwt !== serviceKey) return response({ error: "Unauthorized." }, 401);
      scheduledSearchId =
        typeof body.searchId === "string" ? body.searchId : "";
      scheduledLeaseToken =
        typeof body.leaseToken === "string" ? body.leaseToken : "";
      if (!isUuid(scheduledSearchId) || !isUuid(scheduledLeaseToken)) {
        return response({ error: "Invalid scheduled search lease." }, 400);
      }
      const { data: leasedSearch, error: leaseError } = await admin
        .rpc("begin_scheduled_job_discovery", {
          p_search_id: scheduledSearchId,
          p_lease_token: scheduledLeaseToken,
        })
        .single();
      if (leaseError || !leasedSearch) {
        return response({ error: "Scheduled search lease is no longer valid." }, 409);
      }
      discoveryRequest = normalizeScheduledDiscoveryRequest(
        leasedSearch as Record<string, unknown>,
        scheduledSearchId,
      );
    } else {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
      });
      const {
        data: { user: authUser },
        error: authError,
      } = await userClient.auth.getUser();
      if (authError || !authUser) return response({ error: "Unauthorized." }, 401);
      discoveryRequest = normalizeManualDiscoveryRequest(body, authUser.id);

      const { data: allowed, error: rateError } = await admin.rpc(
        "consume_api_rate_limit",
        {
          p_key: `job-ad-discover:${discoveryRequest.actorId}`,
          p_limit: 3,
          p_window_seconds: 600,
        },
      );
      if (rateError) return response({ error: "Rate limiter unavailable." }, 503);
      if (!allowed) {
        return new Response(
          JSON.stringify({
            error: "Discovery limit reached. Try again shortly.",
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "Retry-After": "600",
            },
          },
        );
      }
    }

    const validationError = validateDiscoveryRequest(discoveryRequest);
    if (validationError) {
      return await fail(400, validationError, "invalid_search");
    }
    const {
      actorId,
      clientId,
      source,
      parameters,
    } = discoveryRequest;
    const {
      searchTerm,
      location,
    } = parameters;
    let search = discoveryRequest.searchId
      ? { id: discoveryRequest.searchId }
      : null;

    const { data: userRow, error: userError } = await admin
      .from("users")
      .select("id, role, client_id")
      .eq("id", actorId)
      .single();
    const role = String(userRow?.role ?? "");
    if (
      userError
      || !userRow
      || !["super_admin", "client_admin"].includes(role)
      || (role !== "super_admin" && userRow.client_id !== clientId)
    ) {
      return await fail(403, "Forbidden.", "actor_forbidden");
    }

    if (!isScheduled) {
      const { data: savedSearch, error: searchError } = await admin
        .from("job_searches")
        .upsert(prepareSavedSearchPayload(
          discoveryRequest,
          new Date().toISOString(),
        ), {
          onConflict:
            "client_id,source,search_term,location,country,work_type,date_range_days",
        })
        .select("id")
        .single();
      if (searchError || !savedSearch) {
        console.error("job-ad-discover search save:", searchError);
        return response({ error: "The saved search could not be created." }, 500);
      }
      search = { id: String(savedSearch.id) };
    }
    if (!search) {
      return await fail(500, "The saved search could not be loaded.", "search_missing");
    }

    const staleCutoff = new Date(Date.now() - 20 * 60_000).toISOString();
    await admin.from("job_discovery_runs").update({
      status: "failed",
      error_code: "stale_run",
      error_message: "The discovery worker stopped before completing.",
      completed_at: new Date().toISOString(),
    }).eq("client_id", clientId)
      .eq("status", "running")
      .lt("started_at", staleCutoff);

    const adapter = DISCOVERY_ADAPTERS[source];
    const { data: run, error: runError } = await admin
      .from("job_discovery_runs")
      .insert(prepareDiscoveryRunPayload({
        request: discoveryRequest,
        searchId: search.id,
        scheduled: isScheduled,
        leaseToken: scheduledLeaseToken,
        adapterVersion: adapter.version,
      }))
      .select("id")
      .single();
    if (runError || !run) {
      return await fail(
        500,
        "The discovery run could not start.",
        "run_start_failed",
      );
    }
    runId = String(run.id);

    const configuredChargeCap = Number(
      Deno.env.get("APIFY_DISCOVERY_MAX_CHARGE_USD") ?? 1,
    );
    const maxChargeUsd = Number.isFinite(configuredChargeCap)
        && configuredChargeCap >= 0.1
        && configuredChargeCap <= 5
      ? configuredChargeCap
      : 1;
    let provider: DiscoveryProviderResult;
    try {
      provider = await discoverJobsWithApify({
        actor: actorForSource(source, {
          seek: Deno.env.get("APIFY_SEEK_ACTOR") || undefined,
          indeed: Deno.env.get("APIFY_INDEED_ACTOR") || undefined,
          linkedin: Deno.env.get("APIFY_LINKEDIN_ACTOR") || undefined,
        }),
        apiKey: apifyKey,
        source,
        parameters,
        maxChargeUsd,
      }, {
        onRunStarted: async (providerRunId) => {
          await admin!.from("job_discovery_runs")
            .update({ provider_run_id: providerRunId })
            .eq("id", runId!);
        },
      });
    } catch (error) {
      if (!(error instanceof DiscoveryProviderError)) throw error;
      return await fail(
        error.responseStatus,
        error.publicMessage,
        error.code,
        error.message,
        error.retryAfterSeconds,
      );
    }
    const { discoveries, completeSnapshot } = provider;
    const { data: savedCounts, error: saveError } = await admin
      .rpc("upsert_job_discoveries_v2", {
        p_client_id: clientId,
        p_run_id: runId,
        p_items: discoveries,
        p_complete_snapshot: completeSnapshot,
      })
      .single();
    if (saveError || !savedCounts) {
      console.error("job-ad-discover save:", saveError);
      return await fail(
        500,
        "The discovered jobs could not be saved.",
        "save_failed",
      );
    }

    const counts = normalizeDiscoveryCounts(
      savedCounts as Record<string, unknown>,
    );
    const {
      resultCount,
      newCount,
      changedCount,
      expiredCount,
    } = counts;
    const now = new Date().toISOString();
    const { error: completeError } = await admin
      .from("job_discovery_runs")
      .update(prepareDiscoveryCompletion({
        counts,
        completeSnapshot,
        providerCostUsd: provider.providerCostUsd,
        durationMs: Date.now() - startedAt,
        completedAt: now,
      }))
      .eq("id", runId);
    if (completeError) {
      return await fail(
        500,
        "Results saved, but run audit failed.",
        "run_audit_failed",
      );
    }
    await admin.from("job_searches")
      .update({ last_run_at: now })
      .eq("id", search.id);
    await finishSchedule(
      admin,
      scheduledSearchId,
      scheduledLeaseToken,
      true,
    );

    return response({
      success: true,
      count: resultCount,
      newCount,
      changedCount,
      expiredCount,
      completeSnapshot,
      searchId: search.id,
      discoveryRunId: runId,
      providerRunId: provider.providerRunId,
      providerCostUsd: provider.providerCostUsd,
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
