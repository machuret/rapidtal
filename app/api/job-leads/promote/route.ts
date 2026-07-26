import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  clientId: z.string().uuid(),
  jobAdId: z.string().uuid(),
  companyId: z.string().uuid(),
}).strict();

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (!["super_admin", "client_admin"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Valid job and company IDs are required." }, { status: 400 });
  const accessError = assertClientAccess(auth.user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data: allowed, error: rateError } = await admin.rpc("consume_api_rate_limit", {
    p_key: `crm-promote:${auth.user.id}`,
    p_limit: 15,
    p_window_seconds: 60,
  });
  if (rateError) return NextResponse.json({ error: "Rate limiter unavailable." }, { status: 503 });
  if (!allowed) return NextResponse.json({ error: "Too many promotion requests." }, { status: 429 });

  const { data, error } = await admin.rpc("promote_lead_company_to_crm", {
    p_actor_id: auth.user.id,
    p_client_id: parsed.data.clientId,
    p_job_ad_id: parsed.data.jobAdId,
    p_company_id: parsed.data.companyId,
  });
  if (error) {
    console.error("[job-leads/promote]", error.code, error.message);
    const status = error.code === "42501" ? 403 : error.code === "P0002" ? 409 : error.code === "23505" ? 409 : 500;
    return NextResponse.json({
      error: status === 409
        ? "Approve both the job and its reviewed company before promotion."
        : "The company could not be promoted.",
    }, { status });
  }
  const company = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ data: company });
}
