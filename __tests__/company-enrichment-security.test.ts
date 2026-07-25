/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "db/migrations/022_company_enrichment.sql"),
  "utf8",
);
const edge = readFileSync(
  join(process.cwd(), "supabase/functions/company-enrich/index.ts"),
  "utf8",
);
const legacy = readFileSync(
  join(process.cwd(), "supabase/functions/engine-jobs-scrape/index.ts"),
  "utf8",
);
const enrichRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/company-enrich/route.ts"),
  "utf8",
);
const reviewRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/company-review/route.ts"),
  "utf8",
);

describe("Phase 3 company security contract", () => {
  test("requires approved jobs in both Edge and atomic database boundaries", () => {
    expect(edge).toContain('job.status !== "approved"');
    expect(migration).toMatch(
      /FROM job_ads[\s\S]*id = p_job_ad_id[\s\S]*client_id = p_client_id[\s\S]*status = 'approved'/,
    );
  });

  test("deduplicates by tenant and normalized domain", () => {
    expect(migration).toContain(
      "CONSTRAINT lead_companies_client_domain_key UNIQUE (client_id, domain)",
    );
    expect(migration).toContain("pg_advisory_xact_lock");
    expect(edge).toContain('.eq("domain", official.domain)');
    expect(edge).toContain('.rpc("reuse_lead_company"');
  });

  test("verifies every required Phase 3 database function", () => {
    expect(migration).toContain(
      "public.upsert_lead_company_enrichment(uuid,uuid,uuid,uuid,jsonb)",
    );
    expect(migration).toContain(
      "public.reuse_lead_company(uuid,uuid,uuid,uuid,uuid)",
    );
    expect(migration).toContain(
      "public.review_lead_company(uuid,uuid,uuid,text)",
    );
  });

  test("separates sourced facts and inferred data", () => {
    expect(migration).toContain("source_backed_data");
    expect(migration).toContain("inferred_data");
    expect(migration).toContain("fact_type IN ('source_backed', 'inferred')");
    expect(migration).toContain("lead_company_facts_source_contract");
  });

  test("allows reads but denies direct authenticated writes", () => {
    expect(migration).toMatch(
      /GRANT SELECT ON[\s\S]*lead_companies, company_enrichment_runs, lead_company_facts,[\s\S]*TO authenticated/,
    );
    expect(migration).toMatch(
      /REVOKE INSERT, UPDATE, DELETE[\s\S]*lead_companies, company_enrichment_runs, lead_company_facts,[\s\S]*lead_company_review_events[\s\S]*FROM authenticated/,
    );
  });

  test("records immutable human company review events", () => {
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS lead_company_review_events");
    expect(migration).toContain("FOR UPDATE");
    expect(migration).toContain("INSERT INTO lead_company_review_events");
    expect(migration).toContain("v_enrichment_hash");
  });

  test("does not create or mutate a CRM contact", () => {
    expect(migration).not.toContain("crm_contacts");
    expect(edge).not.toContain("crm_contacts");
    expect(edge).toContain("Never create, infer, or return a human contact.");
  });

  test("has provider item and billing ceilings", () => {
    expect(edge).toContain("maxItems=4&maxTotalChargeUsd=");
    expect(edge).toContain('Deno.env.get("APIFY_COMPANY_MAX_CHARGE_USD")');
  });

  test("protects both application endpoints with user and tenant authorization", () => {
    for (const route of [enrichRoute, reviewRoute]) {
      expect(route).toContain("requireApiAuth()");
      expect(route).toContain("assertClientAccess");
      expect(route).toContain('"super_admin", "client_admin"');
    }
  });

  test("retires the legacy scraper behind authentication", () => {
    expect(legacy).toContain('authorization?.startsWith("Bearer ")');
    expect(legacy).toContain("auth.getUser()");
    expect(legacy).toContain("status: 410");
    expect(legacy).toContain("endpoint_retired");
  });
});
