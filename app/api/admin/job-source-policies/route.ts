import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  source: z.enum(["seek", "indeed", "linkedin"]),
  enabled: z.boolean(),
  authorizationBasis: z.enum([
    "written_permission",
    "official_api",
    "robots_permitted",
  ]).nullable(),
  authorizationReference: z.string().trim().max(2000).nullable(),
  policyVersion: z.string().trim().min(1).max(100),
}).strict();

export async function PATCH(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (auth.user.role !== "super_admin") {
    return NextResponse.json({ error: "Super admin required." }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (
    !parsed.success
    || (
      parsed.data.enabled
      && (
        !parsed.data.authorizationBasis
        || !parsed.data.authorizationReference
      )
    )
  ) {
    return NextResponse.json({
      error: "Enabling automation requires a documented authorization basis and reference.",
    }, { status: 400 });
  }

  const { data, error } = await createAdminClient()
    .rpc("approve_job_source_access", {
      p_actor_id: auth.user.id,
      p_source: parsed.data.source,
      p_enabled: parsed.data.enabled,
      p_authorization_basis: parsed.data.authorizationBasis,
      p_authorization_reference: parsed.data.authorizationReference,
      p_policy_version: parsed.data.policyVersion,
    });
  if (error) {
    console.error("[admin/job-source-policies]", error.code, error.message);
    return NextResponse.json({
      error: "The source access policy could not be updated.",
    }, { status: error.code === "42501" ? 403 : error.code === "22023" ? 400 : 500 });
  }
  const policy = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ data: policy });
}
