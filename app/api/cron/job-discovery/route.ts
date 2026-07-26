import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

type ClaimedSearch = {
  search_id: string;
  client_id: string;
  lease_token: string;
};

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  const presented = req.headers.get("authorization");
  if (!secret || !presented?.startsWith("Bearer ")) return false;
  const actual = Buffer.from(presented.slice("Bearer ".length));
  const expected = Buffer.from(secret);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function GET(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Scheduler is not configured." }, { status: 503 });
  }
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Scheduler environment is incomplete." }, { status: 503 });
  }

  const admin = createAdminClient();
  const workerId = crypto.randomUUID();
  const { data, error } = await admin.rpc("claim_due_job_searches", {
    p_worker_id: workerId,
    p_limit: 2,
  });
  if (error) {
    console.error("[cron/job-discovery] claim", error.code, error.message);
    return NextResponse.json({ error: "Scheduled searches could not be claimed." }, { status: 500 });
  }

  const claims = (data ?? []) as ClaimedSearch[];
  const results = await Promise.all(claims.map(async (claim) => {
    try {
      const result = await fetch(`${supabaseUrl}/functions/v1/job-ad-discover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
        body: JSON.stringify({
          trigger: "scheduled",
          searchId: claim.search_id,
          leaseToken: claim.lease_token,
        }),
        signal: AbortSignal.timeout(140_000),
      });
      const body = await result.json().catch(() => ({}));
      if (!result.ok) {
        await admin.rpc("finish_job_search_schedule", {
          p_search_id: claim.search_id,
          p_lease_token: claim.lease_token,
          p_succeeded: false,
          p_retry_after_seconds: result.status === 429 ? 3600 : null,
        });
      }
      return {
        searchId: claim.search_id,
        ok: result.ok,
        status: result.status,
        count: Number(body.count ?? 0),
        newCount: Number(body.newCount ?? 0),
        changedCount: Number(body.changedCount ?? 0),
        expiredCount: Number(body.expiredCount ?? 0),
        code: typeof body.code === "string" ? body.code : null,
      };
    } catch (runError) {
      console.error("[cron/job-discovery] run", claim.search_id, runError);
      await admin.rpc("finish_job_search_schedule", {
        p_search_id: claim.search_id,
        p_lease_token: claim.lease_token,
        p_succeeded: false,
        p_retry_after_seconds: null,
      });
      return {
        searchId: claim.search_id,
        ok: false,
        status: 502,
        count: 0,
        newCount: 0,
        changedCount: 0,
        expiredCount: 0,
        code: "worker_unreachable",
      };
    }
  }));

  return NextResponse.json({
    workerId,
    claimed: claims.length,
    succeeded: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).length,
    results,
  });
}
