/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "db/migrations/019_job_ad_review_hardening.sql"),
  "utf8",
);

describe("job-ad review hardening migration", () => {
  test("removes direct authenticated updates to extracted records", () => {
    expect(migration).toContain("REVOKE UPDATE ON TABLE job_ads FROM authenticated");
    expect(migration).toContain('DROP POLICY IF EXISTS "job_ads_client_admin_update"');
  });

  test("limits tenant reads to client administrators", () => {
    expect(migration).toMatch(
      /CREATE POLICY "job_ads_own_client_select"[\s\S]*current_user_role\(\) = 'client_admin'/,
    );
    expect(migration).toMatch(
      /CREATE POLICY "job_scrape_runs_own_client_select"[\s\S]*current_user_role\(\) = 'client_admin'/,
    );
  });

  test("binds decisions to content and extraction hashes", () => {
    expect(migration).toContain("reviewed_content_hash TEXT");
    expect(migration).toContain("reviewed_extraction_hash TEXT");
    expect(migration).toContain("INSERT INTO public.job_ad_review_events");
  });

  test("exposes the privileged review function only to the service role", () => {
    expect(migration).toContain(
      "REVOKE ALL ON FUNCTION review_job_ad(UUID, UUID, UUID, TEXT, TEXT) FROM authenticated",
    );
    expect(migration).toContain(
      "GRANT EXECUTE ON FUNCTION review_job_ad(UUID, UUID, UUID, TEXT, TEXT) TO service_role",
    );
  });
});
