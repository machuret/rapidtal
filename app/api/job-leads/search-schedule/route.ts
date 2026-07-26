import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  clientId: z.string().uuid(),
  searchId: z.string().uuid(),
  enabled: z.boolean(),
  intervalMinutes: z.number().int().min(60).max(10080),
}).strict();

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (!["super_admin", "client_admin"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid saved-search schedule is required." }, { status: 400 });
  }
  const accessError = assertClientAccess(auth.user, parsed.data.clientId);
  if (accessError) return accessError;

  const { data, error } = await createAdminClient()
    .rpc("configure_job_search_schedule", {
      p_actor_id: auth.user.id,
      p_client_id: parsed.data.clientId,
      p_search_id: parsed.data.searchId,
      p_enabled: parsed.data.enabled,
      p_interval_minutes: parsed.data.intervalMinutes,
    });
  if (error) {
    console.error("[job-leads/search-schedule]", error.code, error.message);
    const status = error.code === "42501"
      ? 403
      : error.code === "P0002"
        ? 404
        : error.code === "22023"
          ? 400
          : 500;
    return NextResponse.json({
      error: status === 403
        ? "This source is not approved for scheduled access or the interval is too frequent."
        : "The saved-search schedule could not be updated.",
    }, { status });
  }
  const search = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ data: search });
}
