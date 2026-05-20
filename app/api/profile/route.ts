import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  full_name:  z.string().min(1).max(120).optional(),
  phone:      z.string().max(30).optional().nullable(),
  birthday:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  avatar_url: z.string().url().max(500).optional().nullable(),
});

export async function GET() {
  const result = await requireApiAuth();
  if ("error" in result) return result.error;
  const { user } = result;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("users")
    .select("id, email, full_name, phone, birthday, avatar_url")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const result = await requireApiAuth();
  if ("error" in result) return result.error;
  const { user } = result;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("users")
    .update(parsed.data)
    .eq("id", user.id)
    .select("id, email, full_name, phone, birthday, avatar_url")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const result = await requireApiAuth();
  if ("error" in result) return result.error;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = z.object({
    new_password: z.string().min(8).max(128),
  }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 422 });
  }

  const supabase = createClient();
  const { error: pwErr } = await supabase.auth.updateUser({
    password: parsed.data.new_password,
  });

  if (pwErr) return NextResponse.json({ error: pwErr.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
