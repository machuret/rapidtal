import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const measurableFields = new Set([
  "source_job_id", "title", "company_name", "company_website", "location",
  "remote_type", "employment_type", "salary_min", "salary_max",
  "salary_currency", "salary_period", "description", "responsibilities",
  "skills", "posted_at", "expires_at", "apply_url",
]);
const fields = z.record(z.string().min(1).max(100), z.unknown()).refine(
  (value) => Object.keys(value).length >= 1
    && Object.keys(value).length <= 50
    && Object.keys(value).every((field) => measurableFields.has(field)),
  "Between 1 and 50 labeled fields are required.",
);

const schema = z.object({
  clientId: z.string().uuid(),
  jobAdId: z.string().uuid().nullable().optional(),
  scrapeRunId: z.string().uuid().nullable().optional(),
  fixtureKey: z.string().trim().min(1).max(120),
  fixtureKind: z.enum([
    "structured",
    "dynamic",
    "incomplete",
    "expired",
    "production_sample",
  ]),
  expectedFields: fields,
  actualFields: z.record(z.string().min(1).max(100), z.unknown()),
}).strict();

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (!["super_admin", "client_admin"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid quality measurement." }, { status: 400 });
  }
  const accessError = assertClientAccess(auth.user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data: rateAllowed, error: rateError } = await admin.rpc("consume_api_rate_limit", {
    p_key: `job-quality:${auth.user.id}`,
    p_limit: 30,
    p_window_seconds: 60,
  });
  if (rateError || !rateAllowed) {
    return NextResponse.json(
      { error: rateError ? "Quality measurement service unavailable." : "Too many requests." },
      { status: rateError ? 503 : 429 },
    );
  }

  const { data, error } = await admin.rpc("save_job_extraction_quality_measurement", {
    p_actor_id: auth.user.id,
    p_client_id: parsed.data.clientId,
    p_payload: {
      job_ad_id: parsed.data.jobAdId ?? null,
      scrape_run_id: parsed.data.scrapeRunId ?? null,
      fixture_key: parsed.data.fixtureKey,
      fixture_kind: parsed.data.fixtureKind,
      expected_fields: parsed.data.expectedFields,
      actual_fields: parsed.data.actualFields,
    },
  });
  if (error) {
    const status = error.code === "42501"
      ? 403
      : error.code === "P0002"
        ? 404
        : error.code === "22023"
          ? 400
          : 500;
    return NextResponse.json({ error: "Quality measurement could not be saved." }, { status });
  }
  const measurement = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ data: measurement }, { status: 201 });
}
