import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  clientId: z.string().uuid(),
  alertId: z.string().uuid(),
  action: z.enum(["acknowledged", "resolved"]),
}).strict();

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (!["super_admin", "client_admin"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid alert review request." }, { status: 400 });
  }
  const accessError = assertClientAccess(auth.user, parsed.data.clientId);
  if (accessError) return accessError;

  const { data, error } = await createAdminClient().rpc("review_job_pipeline_alert", {
    p_actor_id: auth.user.id,
    p_client_id: parsed.data.clientId,
    p_alert_id: parsed.data.alertId,
    p_action: parsed.data.action,
  });
  if (error) {
    const status = error.code === "42501" ? 403 : error.code === "22023" ? 400 : 500;
    return NextResponse.json({ error: "The alert could not be updated." }, { status });
  }
  const alert = Array.isArray(data) ? data[0] : data;
  if (!alert) return NextResponse.json({ error: "Alert not found." }, { status: 404 });
  return NextResponse.json({ data: alert });
}
