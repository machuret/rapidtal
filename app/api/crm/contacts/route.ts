import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUSES = ["lead", "prospect", "active", "inactive", "closed"] as const;

const createSchema = z.object({
  clientId:   z.string().uuid(),
  first_name: z.string().min(1).max(100),
  last_name:  z.string().max(100).optional().nullable(),
  email:      z.string().email().max(255).optional().nullable(),
  phone:      z.string().max(50).optional().nullable(),
  company:    z.string().max(200).optional().nullable(),
  job_title:  z.string().max(200).optional().nullable(),
  status:     z.enum(STATUSES).optional().default("lead"),
  source:     z.string().max(200).optional().nullable(),
  notes:      z.string().max(10000).optional().nullable(),
});

const updateSchema = z.object({
  id:         z.string().uuid(),
  clientId:   z.string().uuid(),
  first_name: z.string().min(1).max(100).optional(),
  last_name:  z.string().max(100).optional().nullable(),
  email:      z.string().email().max(255).optional().nullable(),
  phone:      z.string().max(50).optional().nullable(),
  company:    z.string().max(200).optional().nullable(),
  job_title:  z.string().max(200).optional().nullable(),
  status:     z.enum(STATUSES).optional(),
  source:     z.string().max(200).optional().nullable(),
  notes:      z.string().max(10000).optional().nullable(),
});

const deleteSchema = z.object({
  id:       z.string().uuid(),
  clientId: z.string().uuid(),
});

// ── POST: create contact ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input.", issues: parsed.error.flatten() }, { status: 400 });

  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("crm_contacts")
    .insert({
      client_id:  parsed.data.clientId,
      created_by: user.id,
      first_name: parsed.data.first_name.trim(),
      last_name:  parsed.data.last_name?.trim() ?? null,
      email:      parsed.data.email?.trim() ?? null,
      phone:      parsed.data.phone?.trim() ?? null,
      company:    parsed.data.company?.trim() ?? null,
      job_title:  parsed.data.job_title?.trim() ?? null,
      status:     parsed.data.status,
      source:     parsed.data.source?.trim() ?? null,
      tags:       [],
      notes:      parsed.data.notes?.trim() ?? null,
    })
    .select("id, client_id, first_name, last_name, email, phone, company, job_title, status, source, tags, notes, created_at, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// ── PATCH: update contact ─────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input.", issues: parsed.error.flatten() }, { status: 400 });

  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();

  // Verify the contact belongs to this client before updating
  const { data: existing } = await admin
    .from("crm_contacts")
    .select("id")
    .eq("id", parsed.data.id)
    .eq("client_id", parsed.data.clientId)
    .maybeSingle();

  if (!existing) return NextResponse.json({ error: "Contact not found." }, { status: 404 });

  const { id, clientId, ...fields } = parsed.data;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) updates[k] = typeof v === "string" ? v.trim() || null : v;
  }
  // first_name must not be nullified
  if (updates.first_name === null) delete updates.first_name;

  const { data, error } = await admin
    .from("crm_contacts")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(updates as any)
    .eq("id", id)
    .eq("client_id", clientId)
    .select("id, client_id, first_name, last_name, email, phone, company, job_title, status, source, tags, notes, created_at, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ── DELETE: delete contact ────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { error } = await admin
    .from("crm_contacts")
    .delete()
    .eq("id", parsed.data.id)
    .eq("client_id", parsed.data.clientId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
