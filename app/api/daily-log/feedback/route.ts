import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  log_id:   z.string().uuid(),
  feedback: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  if (!["client_admin", "super_admin"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (!user.client_id) return NextResponse.json({ error: "No client." }, { status: 403 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input.", issues: parsed.error.flatten() }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("daily_logs")
    .update({
      admin_feedback: parsed.data.feedback,
      reviewed_at:    new Date().toISOString(),
      reviewed_by:    user.id,
    })
    .eq("id", parsed.data.log_id)
    .eq("client_id", user.client_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
