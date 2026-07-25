/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "db/migrations/020_job_discovery.sql"),
  "utf8",
);

describe("job discovery migration security", () => {
  test("enables RLS on every Phase 2 table", () => {
    expect(migration).toContain("ALTER TABLE job_searches ENABLE ROW LEVEL SECURITY");
    expect(migration).toContain("ALTER TABLE job_discovery_runs ENABLE ROW LEVEL SECURITY");
    expect(migration).toContain("ALTER TABLE job_discoveries ENABLE ROW LEVEL SECURITY");
  });

  test("allows tenant admins to read only their tenant", () => {
    expect(migration).toMatch(
      /job_discoveries_own_client_select[\s\S]*client_id = current_user_client_id\(\)[\s\S]*current_user_role\(\) = 'client_admin'/,
    );
  });

  test("keeps Phase 2 mutations service-owned", () => {
    expect(migration).toContain(
      "REVOKE INSERT, UPDATE, DELETE\n  ON TABLE job_searches, job_discovery_runs, job_discoveries FROM authenticated",
    );
    expect(migration).toContain(
      "REVOKE ALL ON FUNCTION link_job_discovery(UUID, TEXT, UUID) FROM PUBLIC, anon, authenticated",
    );
    expect(migration).toContain("IF auth.role() <> 'service_role'");
  });

  test("enforces tenant-local URL deduplication", () => {
    expect(migration).toContain("UNIQUE (client_id, canonical_url)");
  });
});
