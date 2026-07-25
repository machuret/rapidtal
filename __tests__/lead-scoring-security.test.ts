/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "db/migrations/024_transparent_lead_scoring.sql"),
  "utf8",
);
const engine = readFileSync(join(process.cwd(), "lib/lead-scoring.ts"), "utf8");
const scoreRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/score/route.ts"),
  "utf8",
);
const profileRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/scoring-profile/route.ts"),
  "utf8",
);

describe("Phase 4 transparent scoring security contract", () => {
  test("uses seven fixed components that total 100 points", () => {
    for (const component of [
      "target_role",
      "target_geography",
      "advertisement_recency",
      "hiring_urgency",
      "company_fit",
      "outsourcing_suitability",
      "data_completeness_confidence",
    ]) {
      expect(engine).toContain(component);
      expect(migration).toContain(component);
    }
    expect(migration).toContain("v_component_count <> 7");
    expect(migration).toContain("v_component_total NOT BETWEEN 0 AND 100");
  });

  test("requires approved jobs and approved linked companies at the database boundary", () => {
    expect(migration).toContain("v_job.status <> 'approved'");
    expect(migration).toContain("v_company.status <> 'approved'");
    expect(migration).toContain("v_job.company_id");
  });

  test("rejects forged totals, maximums, and score bands", () => {
    expect(migration).toContain("supplied.max_points = expected.max_points");
    expect(migration).toContain("supplied.points BETWEEN 0 AND expected.max_points");
    expect(migration).toContain("v_component_total <> (p_payload->>'total_score')::INTEGER");
    expect(migration).toContain("p_payload->>'score_band'");
  });

  test("binds scores to exact job, company, profile, and ruleset versions", () => {
    for (const field of [
      "ruleset_version",
      "profile_version",
      "input_hash",
      "job_extraction_hash",
      "company_enrichment_hash",
    ]) {
      expect(migration).toContain(field);
      expect(scoreRoute).toContain(field);
    }
    expect(migration).toContain("score inputs changed before save");
    expect(migration).toContain("lead_scores_reproducible_key");
  });

  test("initializes a profile for future tenants", () => {
    expect(migration).toContain("initialize_lead_scoring_profile");
    expect(migration).toContain("clients_initialize_lead_scoring_profile");
    expect(migration).toContain("AFTER INSERT ON clients");
  });

  test("makes score history immutable to authenticated and service roles", () => {
    expect(migration).toMatch(
      /REVOKE INSERT, UPDATE, DELETE[\s\S]*ON lead_scoring_profiles, lead_scores, lead_score_components[\s\S]*FROM authenticated, service_role/,
    );
    expect(migration).toContain("SECURITY DEFINER");
  });

  test("protects scoring and profile APIs with role and tenant checks", () => {
    for (const route of [scoreRoute, profileRoute]) {
      expect(route).toContain("requireApiAuth()");
      expect(route).toContain("assertClientAccess");
      expect(route).toContain('"super_admin", "client_admin"');
    }
  });

  test("contains no model call or opaque AI score", () => {
    expect(engine).not.toMatch(/openai|chat\.completions|responses\.create/i);
    expect(scoreRoute).not.toMatch(/openai|chat\.completions|responses\.create/i);
    expect(engine).toContain("reason:");
    expect(engine).toContain("inputs:");
  });

  test("never creates a human CRM contact", () => {
    expect(migration).not.toContain("crm_contacts");
    expect(scoreRoute).not.toContain("crm_contacts");
  });
});
