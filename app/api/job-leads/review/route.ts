import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  clientId: z.string().uuid(),
  jobAdId: z.string().uuid(),
  status: z.enum(["needs_review", "approved", "rejected"]),
  notes: z.string().trim().max(1000).optional().nullable(),
}).strict();

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
    return NextResponse.json(
      { error: "A valid job, client, and review status are required." },
      { status: 400 },
    );
  }

  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("review_job_ad", {
    p_actor_id: user.id,
    p_client_id: parsed.data.clientId,
    p_job_ad_id: parsed.data.jobAdId,
    p_status: parsed.data.status,
    p_notes: parsed.data.notes ?? null,
  });

  if (error) {
    console.error("[job-leads/review]", error.code, error.message);
    const status = error.code === "P0002" ? 404 : error.code === "42501" ? 403 : 500;
    return NextResponse.json(
      { error: status === 404 ? "Job advertisement not found." : "Review update failed." },
      { status },
    );
  }

  const reviewed = Array.isArray(data) ? data[0] : data;
  if (!reviewed) {
    return NextResponse.json({ error: "Job advertisement not found." }, { status: 404 });
  }

  return NextResponse.json({ data: reviewed });
}
