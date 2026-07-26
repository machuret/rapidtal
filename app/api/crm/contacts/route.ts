import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUSES = ["lead", "prospect", "active", "inactive", "closed"] as const;
const CONTACT_SELECT = "id, client_id, first_name, last_name, email, phone, company, job_title, status, source, tags, notes, created_by, crm_company_id, verification_status, verified_by, verified_at, created_at, updated_at";

const createSchema = z.object({
  clientId:   z.string().uuid(),
  first_name: z.string().trim().min(1).max(100),
  last_name:  z.string().trim().max(100).optional().nullable(),
  email:      z.string().trim().email().max(255).optional().nullable(),
  phone:      z.string().trim().max(50).optional().nullable(),
  company:    z.string().trim().max(200).optional().nullable(),
  job_title:  z.string().trim().max(200).optional().nullable(),
  status:     z.enum(STATUSES).optional().default("lead"),
  source:     z.string().trim().max(200).optional().nullable(),
  notes:      z.string().trim().max(10000).optional().nullable(),
});

const updateSchema = z.object({
  id:         z.string().uuid(),
  clientId:   z.string().uuid(),
  first_name: z.string().trim().min(1).max(100).optional(),
  last_name:  z.string().trim().max(100).optional().nullable(),
  email:      z.string().trim().email().max(255).optional().nullable(),
  phone:      z.string().trim().max(50).optional().nullable(),
  company:    z.string().trim().max(200).optional().nullable(),
  job_title:  z.string().trim().max(200).optional().nullable(),
  status:     z.enum(STATUSES).optional(),
  source:     z.string().trim().max(200).optional().nullable(),
  notes:      z.string().trim().max(10000).optional().nullable(),
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
  const normalizedEmail = parsed.data.email?.toLowerCase() || null;
  if (normalizedEmail) {
    const { data: duplicate } = await admin
      .from("crm_contacts")
      .select("id")
      .eq("client_id", parsed.data.clientId)
      .ilike("email", normalizedEmail)
      .limit(1)
      .maybeSingle();
    if (duplicate) {
      return NextResponse.json(
        { error: "A contact with this email already exists." },
        { status: 409 },
      );
    }
  }

  const { data, error } = await admin
    .from("crm_contacts")
    .insert({
      client_id:  parsed.data.clientId,
      created_by: user.id,
      first_name: parsed.data.first_name,
      last_name:  parsed.data.last_name || null,
      email:      normalizedEmail,
      phone:      parsed.data.phone || null,
      company:    parsed.data.company || null,
      job_title:  parsed.data.job_title || null,
      status:     parsed.data.status,
      source:     parsed.data.source || null,
      tags:       [],
      notes:      parsed.data.notes || null,
    })
    .select(CONTACT_SELECT)
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({
      error: status === 409
        ? "A contact with this email or phone already exists."
        : error.message,
    }, { status });
  }
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

  const normalizedEmail = parsed.data.email?.toLowerCase() || null;
  if (normalizedEmail) {
    const { data: duplicate } = await admin
      .from("crm_contacts")
      .select("id")
      .eq("client_id", parsed.data.clientId)
      .ilike("email", normalizedEmail)
      .neq("id", parsed.data.id)
      .limit(1)
      .maybeSingle();
    if (duplicate) {
      return NextResponse.json(
        { error: "A contact with this email already exists." },
        { status: 409 },
      );
    }
  }

  const { id, clientId, ...fields } = parsed.data;
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== undefined) updates[k] = typeof v === "string" ? v.trim() || null : v;
  }
  if (parsed.data.email !== undefined) updates.email = normalizedEmail;
  // first_name must not be nullified
  if (updates.first_name === null) delete updates.first_name;

  const { data, error } = await admin
    .from("crm_contacts")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(updates as any)
    .eq("id", id)
    .eq("client_id", clientId)
    .select(CONTACT_SELECT)
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    return NextResponse.json({
      error: status === 409
        ? "A contact with this email or phone already exists."
        : error.message,
    }, { status });
  }
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
