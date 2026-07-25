import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  client_id:          z.string().uuid(),
  company_name:       z.string().trim().max(200).optional().nullable(),
  founders:           z.string().trim().max(500).optional().nullable(),
  location:           z.string().trim().max(200).optional().nullable(),
  phone:              z.string().trim().max(50).optional().nullable(),
  email:              z.union([z.literal(""), z.string().trim().email().max(200)]).optional().nullable(),
  website:            z.union([z.literal(""), z.string().trim().url().max(300)]).optional().nullable(),
  client_type:        z.string().trim().max(100).optional().nullable(),
  target_demographic: z.string().trim().max(500).optional().nullable(),
  values:             z.string().trim().max(2000).optional().nullable(),
  services:           z.string().trim().max(2000).optional().nullable(),
  // extra is a NOT NULL JSONB column — must be present on first INSERT
  extra:              z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  const result = await requireApiAuth();
  if ("error" in result) return result.error;
  const { user } = result;

  if (user.role !== "client_admin" && user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const denied = assertClientAccess(user, parsed.data.client_id);
  if (denied) return denied;

  const admin = createAdminClient();
  const { client_id, ...fields } = parsed.data;
  const updatedAt = new Date().toISOString();

  // Check whether a row already exists for this client.
  // We do insert vs update explicitly rather than upsert so that:
  //   INSERT path: all non-null defaults (extra JSONB) are provided
  //   UPDATE path: only the fields the user actually submitted are written —
  //                no risk of nulling out fields not present in this request
  const { data: existing } = await admin
    .from("company_dna")
    .select("id")
    .eq("client_id", client_id)
    .maybeSingle();

  let data, error;

  if (existing) {
    // Row exists — update only the submitted fields
    ({ data, error } = await admin
      .from("company_dna")
      .update({ ...fields, updated_at: updatedAt })
      .eq("client_id", client_id)
      .select()
      .single());
  } else {
    // No row yet — insert with all required columns including extra
    ({ data, error } = await admin
      .from("company_dna")
      .insert({ client_id, ...fields, extra: fields.extra ?? {}, updated_at: updatedAt })
      .select()
      .single());
  }

  if (error) {
    console.error("[company-dna POST] DB error:", error.code, error.message, error.details);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
