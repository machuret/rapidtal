import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  clientId: z.string().uuid(),
  companyId: z.string().uuid(),
  status: z.enum(["needs_review", "approved", "rejected"]),
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
    return NextResponse.json({ error: "Invalid company review request." }, { status: 400 });
  }
  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("review_lead_company", {
    p_actor_id: user.id,
    p_client_id: parsed.data.clientId,
    p_company_id: parsed.data.companyId,
    p_status: parsed.data.status,
  });
  if (error) {
    const status = error.code === "P0002" ? 404 : error.code === "42501" ? 403 : 500;
    return NextResponse.json(
      { error: status === 404 ? "Company not found." : "Company review failed." },
      { status },
    );
  }
  const company = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ data: company });
}
