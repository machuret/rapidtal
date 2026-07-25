import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const value = z.string().trim().min(1).max(100);
const schema = z.object({
  clientId: z.string().uuid(),
  targetRoles: z.array(value).max(100),
  targetGeographies: z.array(value).max(50),
  preferredIndustries: z.array(value).max(50),
  companyFitKeywords: z.array(value).max(100),
}).strict();

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  return values.filter((entry) => {
    const key = entry.toLocaleLowerCase("en");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;
  if (!["super_admin", "client_admin"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead-scoring profile." }, { status: 400 });
  }
  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data: rateAllowed, error: rateError } = await admin.rpc("consume_api_rate_limit", {
    p_key: `lead-scoring-profile:${user.id}`,
    p_limit: 10,
    p_window_seconds: 60,
  });
  if (rateError) return NextResponse.json({ error: "Rate limiter unavailable." }, { status: 503 });
  if (!rateAllowed) return NextResponse.json({ error: "Too many profile updates." }, { status: 429 });

  const { data, error } = await admin.rpc("update_lead_scoring_profile", {
    p_actor_id: user.id,
    p_client_id: parsed.data.clientId,
    p_target_roles: unique(parsed.data.targetRoles),
    p_target_geographies: unique(parsed.data.targetGeographies),
    p_preferred_industries: unique(parsed.data.preferredIndustries),
    p_company_fit_keywords: unique(parsed.data.companyFitKeywords),
  });
  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "22023" ? 400 : 500;
    return NextResponse.json(
      { error: status === 400 ? "Invalid scoring profile." : "Scoring profile could not be saved." },
      { status },
    );
  }
  const profile = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ data: profile });
}
