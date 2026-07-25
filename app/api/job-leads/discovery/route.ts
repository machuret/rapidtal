import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  clientId: z.string().uuid(),
  discoveryId: z.string().uuid(),
  status: z.enum(["new", "dismissed"]),
}).strict();

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (!["super_admin", "client_admin"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid discovery update is required." }, { status: 400 });
  }
  const accessError = assertClientAccess(auth.user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data, error } = await admin.from("job_discoveries").update({
    status: parsed.data.status,
    updated_at: new Date().toISOString(),
  }).eq("id", parsed.data.discoveryId)
    .eq("client_id", parsed.data.clientId)
    .neq("status", "imported")
    .select("id, status")
    .maybeSingle();
  if (error) {
    console.error("[job-leads/discovery]", error.code, error.message);
    return NextResponse.json({ error: "Discovery status could not be updated." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Discovery not found." }, { status: 404 });
  return NextResponse.json({ data });
}
