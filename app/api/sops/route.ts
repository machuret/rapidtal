import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const createSchema = z.object({
  clientId:    z.string().uuid(),
  title:       z.string().min(1).max(300),
  category:    z.string().max(100).optional().default("General"),
  body:        z.string().min(1).max(100000),
  order_index: z.number().int().optional().default(0),
});

const updateSchema = z.object({
  id:       z.string().uuid(),
  clientId: z.string().uuid(),
  title:    z.string().min(1).max(300).optional(),
  category: z.string().max(100).optional(),
  body:     z.string().min(1).max(100000).optional(),
});

const deleteSchema = z.object({
  id:       z.string().uuid(),
  clientId: z.string().uuid(),
});

const SELECT = "id, client_id, title, category, body, order_index, created_at, updated_at";

// ── POST: create SOP ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  if (!["client_admin", "super_admin"].includes(user.role)) {
    return NextResponse.json({ error: "Only admins can create SOPs." }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input.", issues: parsed.error.flatten() }, { status: 400 });

  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("sops")
    .insert({
      client_id:   parsed.data.clientId,
      created_by:  user.id,
      title:       parsed.data.title.trim(),
      category:    parsed.data.category.trim() || "General",
      body:        parsed.data.body,
      order_index: parsed.data.order_index,
      updated_at:  new Date().toISOString(),
    })
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// ── PATCH: update SOP ─────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  if (!["client_admin", "super_admin"].includes(user.role)) {
    return NextResponse.json({ error: "Only admins can edit SOPs." }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input.", issues: parsed.error.flatten() }, { status: 400 });

  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();

  // Verify ownership
  const { data: existing } = await admin
    .from("sops")
    .select("id")
    .eq("id", parsed.data.id)
    .eq("client_id", parsed.data.clientId)
    .maybeSingle();

  if (!existing) return NextResponse.json({ error: "SOP not found." }, { status: 404 });

  const { id, clientId, ...fields } = parsed.data;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) updates[k] = typeof v === "string" ? v.trim() || null : v;
  }
  if (updates.title === null) delete updates.title;
  if (updates.body === null) delete updates.body;

  const { data, error } = await admin
    .from("sops")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(updates as any)
    .eq("id", id)
    .eq("client_id", clientId)
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ── DELETE: delete SOP ────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  if (!["client_admin", "super_admin"].includes(user.role)) {
    return NextResponse.json({ error: "Only admins can delete SOPs." }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { error } = await admin
    .from("sops")
    .delete()
    .eq("id", parsed.data.id)
    .eq("client_id", parsed.data.clientId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
