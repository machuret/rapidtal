import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  calculateLeadScore,
  LEAD_SCORING_RULESET,
} from "@/lib/lead-scoring";

const schema = z.object({
  clientId: z.string().uuid(),
  jobAdId: z.string().uuid(),
}).strict();

export async function POST(req: NextRequest) {
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
    return NextResponse.json(
      { error: "A valid client and approved job advertisement are required." },
      { status: 400 },
    );
  }
  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  const admin = createAdminClient();
  const { data: rateAllowed, error: rateError } = await admin.rpc("consume_api_rate_limit", {
    p_key: `lead-score:${user.id}`,
    p_limit: 30,
    p_window_seconds: 60,
  });
  if (rateError) return NextResponse.json({ error: "Rate limiter unavailable." }, { status: 503 });
  if (!rateAllowed) return NextResponse.json({ error: "Too many scoring requests." }, { status: 429 });

  const { data: job, error: jobError } = await admin
    .from("job_ads")
    .select(`
      id, client_id, company_id, status, title, company_name, location,
      remote_type, employment_type, description, responsibilities, skills,
      posted_at, expires_at, extraction_confidence, extraction_hash
    `)
    .eq("id", parsed.data.jobAdId)
    .eq("client_id", parsed.data.clientId)
    .single();
  if (
    jobError
    || !job
    || !["extracted", "needs_review", "approved"].includes(job.status)
    || !job.company_id
    || !job.extraction_hash
  ) {
    return NextResponse.json(
      { error: "Extract the advertisement and link an enriched company before scoring." },
      { status: 409 },
    );
  }

  const [{ data: company }, { data: profile }] = await Promise.all([
    admin
      .from("lead_companies")
      .select("id, status, domain, industry, location, services, description, evidence, enrichment_hash")
      .eq("id", job.company_id)
      .eq("client_id", parsed.data.clientId)
      .single(),
    admin
      .from("lead_scoring_profiles")
      .select("*")
      .eq("client_id", parsed.data.clientId)
      .single(),
  ]);
  if (!company || !["needs_review", "approved"].includes(company.status)) {
    return NextResponse.json({ error: "Enrich the employer company before scoring." }, { status: 409 });
  }
  if (!profile) {
    return NextResponse.json({ error: "Configure a lead-scoring profile first." }, { status: 409 });
  }

  const calculated = calculateLeadScore(
    {
      title: job.title,
      companyName: job.company_name,
      location: job.location,
      remoteType: job.remote_type,
      employmentType: job.employment_type,
      description: job.description,
      responsibilities: job.responsibilities,
      skills: job.skills,
      postedAt: job.posted_at,
      expiresAt: job.expires_at,
      extractionConfidence: Number(job.extraction_confidence),
    },
    {
      domain: company.domain,
      industry: company.industry,
      location: company.location,
      services: company.services,
      description: company.description,
      evidence: company.evidence,
    },
    {
      version: profile.version,
      targetRoles: profile.target_roles,
      targetGeographies: profile.target_geographies,
      preferredIndustries: profile.preferred_industries,
      companyFitKeywords: profile.company_fit_keywords,
    },
  );

  const inputHash = createHash("sha256").update(JSON.stringify({
    rulesetVersion: LEAD_SCORING_RULESET,
    profileId: profile.id,
    profileVersion: profile.version,
    targetRoles: profile.target_roles,
    targetGeographies: profile.target_geographies,
    preferredIndustries: profile.preferred_industries,
    companyFitKeywords: profile.company_fit_keywords,
    jobExtractionHash: job.extraction_hash,
    companyEnrichmentHash: company.enrichment_hash,
    score: calculated,
  })).digest("hex");

  const { data, error } = await admin.rpc("save_transparent_lead_score", {
    p_actor_id: user.id,
    p_client_id: parsed.data.clientId,
    p_job_ad_id: parsed.data.jobAdId,
    p_payload: {
      scoring_profile_id: profile.id,
      profile_version: profile.version,
      ruleset_version: calculated.rulesetVersion,
      input_hash: inputHash,
      job_extraction_hash: job.extraction_hash,
      company_enrichment_hash: company.enrichment_hash,
      total_score: calculated.totalScore,
      score_band: calculated.scoreBand,
      summary: calculated.summary,
      components: calculated.components.map((component) => ({
        component: component.component,
        points: component.points,
        max_points: component.maxPoints,
        reason: component.reason,
        inputs: component.inputs,
      })),
    },
  });
  if (error) {
    const status = error.code === "40001"
      ? 409
      : error.code === "P0002"
        ? 409
        : error.code === "42501"
          ? 403
          : 500;
    return NextResponse.json(
      {
        error: status === 409
          ? "The job, company, or scoring profile changed. Refresh and score again."
          : "Lead scoring could not be saved.",
      },
      { status },
    );
  }
  const saved = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ data: saved, components: calculated.components });
}
