import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { canonicalizePublicJobUrl } from "@/supabase/functions/_shared/job-url";

const optionalText = (max: number) => z.string().trim().max(max).optional().nullable();
const schema = z.object({
  clientId: z.string().uuid(),
  crmCompanyId: z.string().uuid(),
  firstName: z.string().trim().min(1).max(100),
  lastName: optionalText(100),
  email: z.union([z.string().trim().email().max(255), z.literal("")]).optional().nullable(),
  phone: optionalText(50),
  jobTitle: optionalText(200),
  verificationMethod: z.enum(["company_website", "linkedin", "email", "phone", "manual_research"]),
  sourceUrl: z.string().url().max(2048).refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" && !parsed.username && !parsed.password;
    } catch {
      return false;
    }
  }, "Public credential-free HTTPS URL required"),
  evidenceNote: z.string().trim().min(1).max(2000),
}).strict().refine((value) => Boolean(value.email?.trim() || value.phone?.trim()), {
  message: "Email or phone required.",
});

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (!["super_admin", "client_admin"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a real person, contact method, and verification evidence." }, { status: 400 });
  const accessError = assertClientAccess(auth.user, parsed.data.clientId);
  if (accessError) return accessError;
  const evidenceUrl = canonicalizePublicJobUrl(parsed.data.sourceUrl);
  if (!evidenceUrl) {
    return NextResponse.json(
      { error: "Verification evidence must use a public HTTPS page." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data: allowed, error: rateError } = await admin.rpc("consume_api_rate_limit", {
    p_key: `verified-contact:${auth.user.id}`,
    p_limit: 10,
    p_window_seconds: 60,
  });
  if (rateError) return NextResponse.json({ error: "Rate limiter unavailable." }, { status: 503 });
  if (!allowed) return NextResponse.json({ error: "Too many contact requests." }, { status: 429 });

  const { data, error } = await admin.rpc("add_verified_crm_contact", {
    p_actor_id: auth.user.id,
    p_client_id: parsed.data.clientId,
    p_crm_company_id: parsed.data.crmCompanyId,
    p_payload: {
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName || null,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      job_title: parsed.data.jobTitle || null,
      verification_method: parsed.data.verificationMethod,
      source_url: evidenceUrl.canonicalUrl,
      evidence_note: parsed.data.evidenceNote,
    },
  });
  if (error) {
    console.error("[job-leads/verified-contact]", error.code, error.message);
    const status = error.code === "42501" ? 403 : error.code === "P0002" ? 404 : error.code === "23505" ? 409 : error.code === "22023" ? 400 : 500;
    return NextResponse.json({
      error: status === 409 ? "A CRM contact with that email or phone already exists." : "The verified contact could not be added.",
    }, { status });
  }
  const contact = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ data: contact }, { status: 201 });
}
