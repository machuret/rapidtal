/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const migration = read("db/migrations/026_phase_5_hardening.sql");
const jobLeadsPage = read("app/(portal)/job-leads/page.tsx");
const crmPage = read("app/(portal)/crm/page.tsx");
const crmContactRoute = read("app/api/crm/contacts/route.ts");
const verifiedContactRoute = read("app/api/job-leads/verified-contact/route.ts");
const duplicateRoute = read("app/api/job-leads/duplicates/route.ts");

describe("Phase 5 hardening contract", () => {
  test("enforces tenant-scoped email and normalized-phone uniqueness", () => {
    expect(migration).toMatch(
      /CREATE UNIQUE INDEX IF NOT EXISTS crm_contacts_client_email_unique_idx[\s\S]*client_id, lower\(btrim\(email\)\)/,
    );
    expect(migration).toMatch(
      /CREATE UNIQUE INDEX IF NOT EXISTS crm_contacts_client_phone_unique_idx[\s\S]*client_id, regexp_replace\(phone/,
    );
    expect(migration).toContain("Migration 026 stopped: duplicate CRM email identities exist");
    expect(migration).toContain("Migration 026 stopped: duplicate CRM phone identities exist");
  });

  test("locks both supplied identities in stable order", () => {
    expect(migration).toContain("':crm-contact:email:' || v_email");
    expect(migration).toContain("':crm-contact:phone:' || v_phone_identity");
    expect(migration).toMatch(/FROM unnest\(v_lock_keys\)[\s\S]*ORDER BY key_value/);
    expect(migration).toContain("pg_advisory_xact_lock(v_lock_key)");
  });

  test("only upgrades a matching unverified person and records evidence", () => {
    expect(migration).toContain("v_existing.verification_status = 'unverified'");
    expect(migration).toContain("v_existing_name = v_expected_name");
    expect(migration).toContain("verification_status = 'verified'");
    expect(migration).toContain("INSERT INTO crm_contact_verifications");
  });

  test("rejects evidence URLs containing credentials at API and database layers", () => {
    expect(verifiedContactRoute).toContain("!parsed.username && !parsed.password");
    expect(verifiedContactRoute).toContain("canonicalizePublicJobUrl(parsed.data.sourceUrl)");
    expect(verifiedContactRoute).toContain("source_url: evidenceUrl.canonicalUrl");
    expect(migration).toContain("v_source_url ~ '^https://[^/]*@'");
    expect(migration).toContain("crm_contact_verifications_source_url_safe");
  });

  test("filters before bounded database pagination", () => {
    expect(jobLeadsPage).toContain('.select(jobSelect, { count: "exact" })');
    expect(jobLeadsPage).toContain('.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)');
    expect(jobLeadsPage).toContain('jobQuery.eq("status"');
    expect(jobLeadsPage).toContain('jobQuery.eq("score_filter.score_band"');
    expect(jobLeadsPage).not.toContain("jobs.filter((job) =>");
  });

  test("performs tenant-authorized duplicate preview without a global row cap", () => {
    expect(duplicateRoute).toContain("requireApiAuth()");
    expect(duplicateRoute).toContain("assertClientAccess");
    expect(duplicateRoute).toContain("canonicalizePublicJobUrl");
    expect(duplicateRoute).toContain('.in("canonical_url", canonicalUrls)');
    expect(duplicateRoute).not.toMatch(/\.limit\(/);
  });

  test("shows only current failures and verified CRM counts", () => {
    expect(jobLeadsPage).toContain("if (!latestScrapeRuns.has(key))");
    expect(jobLeadsPage).toContain('.filter((run) => run.status === "failed")');
    expect(crmPage).toContain('contact.verification_status === "verified"');
  });

  test("contact mutations return complete verification state", () => {
    for (const field of [
      "created_by",
      "crm_company_id",
      "verification_status",
      "verified_by",
      "verified_at",
    ]) {
      expect(crmContactRoute).toContain(field);
    }
    expect(crmContactRoute).toContain('error.code === "23505" ? 409 : 500');
  });
});
