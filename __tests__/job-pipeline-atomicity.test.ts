/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "db/migrations/021_job_pipeline_atomicity.sql"),
  "utf8",
);
const completion = readFileSync(
  join(process.cwd(), "db/migrations/030_lead_engine_completion.sql"),
  "utf8",
);
const ingest = readFileSync(
  join(process.cwd(), "supabase/functions/job-ad-ingest/index.ts"),
  "utf8",
);
const discover = readFileSync(
  join(process.cwd(), "supabase/functions/job-ad-discover/index.ts"),
  "utf8",
);

describe("atomic job pipeline hardening", () => {
  test("serializes extraction upserts and locks the current review row", () => {
    expect(completion).toContain("pg_advisory_xact_lock");
    expect(completion).toContain("job_ad_identities");
    expect(completion).toContain("'canonical_url'");
    expect(completion).toContain("'source_job_id'");
    expect(completion).toContain("'content_fingerprint'");
    expect(completion).toContain("ORDER BY key");
    expect(completion).toContain("job identities resolve to conflicting records");
    expect(completion).toContain(
      "v_existing.reviewed_content_hash = v_content_hash",
    );
    expect(completion).toContain(
      "v_existing.reviewed_extraction_hash = v_extraction_hash",
    );
  });

  test("closes direct service-role writes around the identity ledger", () => {
    expect(completion).toContain(
      "REVOKE INSERT, UPDATE, DELETE ON job_ads FROM service_role",
    );
    expect(completion).toContain(
      "REVOKE INSERT, UPDATE, DELETE ON job_ad_identities FROM authenticated, service_role",
    );
  });

  test("keeps discovery decisions out of metadata refresh updates", () => {
    const updateSection = migration.slice(
      migration.indexOf("-- Deliberately excludes status and job_ad_id"),
      migration.indexOf("RETURN NEXT;", migration.indexOf("-- Deliberately excludes status and job_ad_id")),
    );
    expect(updateSection).not.toMatch(/\bstatus\s*=/);
    expect(updateSection).not.toMatch(/\bjob_ad_id\s*=/);
    expect(updateSection).toContain("last_seen_at = now()");
  });

  test("restricts both atomic functions to service role", () => {
    expect(migration.match(/IF auth\.role\(\) <> 'service_role'/g)).toHaveLength(2);
    expect(migration).toContain(
      "REVOKE ALL ON FUNCTION upsert_job_ad_extraction(UUID, UUID, JSONB)",
    );
    expect(migration).toContain(
      "REVOKE ALL ON FUNCTION upsert_job_discoveries(UUID, UUID, JSONB)",
    );
  });

  test("Edge handlers use atomic RPCs instead of direct upserts", () => {
    expect(ingest).toContain('.rpc("upsert_job_ad_extraction"');
    expect(ingest).not.toContain('.from("job_ads")\n      .upsert(');
    expect(discover).toContain('.rpc("upsert_job_discoveries_v2"');
    expect(discover).not.toContain('.from("job_discoveries").upsert(');
  });

  test("Phase 1 has API-level result and charge ceilings", () => {
    expect(ingest).toContain("maxItems=1&maxTotalChargeUsd=");
    expect(ingest).toContain('Deno.env.get("APIFY_INGEST_MAX_CHARGE_USD")');
  });

  test("prompt example includes every required evidence field", () => {
    expect(ingest).toContain(
      '"description": "short supporting source excerpt"',
    );
  });
});
