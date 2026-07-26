/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "db/migrations/028_testing_and_observability.sql"),
  "utf8",
);
const ingestion = readFileSync(
  join(process.cwd(), "supabase/functions/job-ad-ingest/index.ts"),
  "utf8",
);
const alertRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/alerts/route.ts"),
  "utf8",
);
const atomicity = readFileSync(
  join(process.cwd(), "db/migrations/021_job_pipeline_atomicity.sql"),
  "utf8",
);
const enrichment = readFileSync(
  join(process.cwd(), "db/migrations/022_company_enrichment.sql"),
  "utf8",
);

describe("Phase 7 observability and release security", () => {
  test("tracks labeled accuracy separately from operational success", () => {
    expect(migration).toContain("job_extraction_quality_measurements");
    expect(migration).toContain("field_accuracy");
    expect(migration).toContain("matched_fields");
    expect(migration).toContain("measured_fields");
    expect(migration).toContain("save_job_extraction_quality_measurement");
  });

  test("persists latency and both provider and estimated AI cost", () => {
    expect(migration).toContain("provider_cost_usd");
    expect(migration).toContain("ai_estimated_cost_usd");
    expect(ingestion).toContain("provider_cost_usd: providerCostUsd");
    expect(ingestion).toContain("ai_estimated_cost_usd: aiEstimatedCostUsd");
    expect(ingestion).toContain("duration_ms: Date.now() - startedAt");
  });

  test("alerts immediately and escalates repeated failures", () => {
    expect(migration).toContain("record_job_pipeline_failure_alert");
    expect(migration).toContain("v_recent_failures >= 3");
    expect(migration).toContain("'repeated_failure'");
    expect(migration).toContain("job_pipeline_alerts_open_fingerprint_idx");
    expect(migration).toContain("occurrence_count = job_pipeline_alerts.occurrence_count + 1");
  });

  test("keeps alert context credential-free", () => {
    const context = migration.slice(
      migration.indexOf("jsonb_build_object("),
      migration.indexOf("ON CONFLICT", migration.indexOf("jsonb_build_object(")),
    );
    expect(context).toContain("'run_id'");
    expect(context).toContain("'error_code'");
    expect(context).not.toContain("error_message");
    expect(context).not.toContain("requested_url");
  });

  test("enforces tenant isolation and service-only writes", () => {
    expect(migration).toContain("job_pipeline_alerts_own_client_select");
    expect(migration).toContain("job_extraction_quality_own_client_select");
    expect(migration).toMatch(
      /REVOKE INSERT, UPDATE, DELETE[\s\S]*job_extraction_quality_measurements, job_pipeline_alerts[\s\S]*FROM authenticated/,
    );
    expect(migration).toContain("auth.role() <> 'service_role'");
    expect(migration).toContain("v_actor_client IS DISTINCT FROM p_client_id");
    expect(alertRoute).toContain("requireApiAuth()");
    expect(alertRoute).toContain("assertClientAccess");
  });

  test("retains database-enforced job and company idempotency", () => {
    expect(atomicity).toContain("pg_advisory_xact_lock");
    expect(atomicity).toMatch(/WHERE client_id = p_client_id[\s\S]*canonical_url = v_canonical_url/);
    expect(enrichment).toContain(
      "CONSTRAINT lead_companies_client_domain_key UNIQUE (client_id, domain)",
    );
    expect(enrichment).toContain("pg_advisory_xact_lock");
  });
});
