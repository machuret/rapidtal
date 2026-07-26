/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "db/migrations/025_review_and_crm_promotion.sql"),
  "utf8",
);
const promoteRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/promote/route.ts"),
  "utf8",
);
const contactRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/verified-contact/route.ts"),
  "utf8",
);
const ingestRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/ingest/route.ts"),
  "utf8",
);
const enrichmentRoute = readFileSync(
  join(process.cwd(), "app/api/job-leads/company-enrich/route.ts"),
  "utf8",
);

describe("Phase 5 review and CRM promotion security contract", () => {
  test("requires an approved linked job and approved reviewed company", () => {
    expect(migration).toContain("v_job.status <> 'approved'");
    expect(migration).toContain("v_job.company_id IS DISTINCT FROM p_company_id");
    expect(migration).toContain("v_company.status <> 'approved'");
    expect(migration).toContain("v_company.reviewed_by IS NULL");
    expect(migration).toContain("v_company.reviewed_at IS NULL");
  });

  test("makes promotion explicit and tenant-scoped", () => {
    expect(promoteRoute).toContain("requireApiAuth()");
    expect(promoteRoute).toContain("assertClientAccess");
    expect(promoteRoute).toContain("promote_lead_company_to_crm");
    expect(migration).toContain("auth.role() <> 'service_role'");
    expect(migration).toContain("client_id = p_client_id");
    expect(migration).toContain("pg_advisory_xact_lock");
  });

  test("does not promote from scraping or enrichment side effects", () => {
    expect(ingestRoute).not.toContain("crm_companies");
    expect(ingestRoute).not.toContain("crm_contacts");
    expect(enrichmentRoute).not.toContain("crm_companies");
    expect(enrichmentRoute).not.toContain("crm_contacts");
  });

  test("company promotion never manufactures a human contact", () => {
    const promotionFunction = migration.split("CREATE OR REPLACE FUNCTION add_verified_crm_contact")[0];
    expect(promotionFunction).not.toMatch(/INSERT INTO crm_contacts/);
    expect(promotionFunction).toContain("INSERT INTO crm_companies");
    expect(promotionFunction).toContain("INSERT INTO crm_company_promotion_events");
  });

  test("requires identity and source evidence before adding a person", () => {
    expect(contactRoute).toContain("Email or phone required.");
    expect(contactRoute).toContain("sourceUrl");
    expect(contactRoute).toContain("evidenceNote");
    expect(migration).toContain("(v_email IS NULL AND v_phone IS NULL)");
    expect(migration).toContain("length(v_evidence_note) NOT BETWEEN 1 AND 2000");
    expect(migration).toContain("v_source_url !~ '^https://'");
  });

  test("preserves immutable promotion and verification evidence", () => {
    expect(migration).toMatch(
      /REVOKE INSERT, UPDATE, DELETE ON[\s\S]*crm_companies, crm_company_promotion_events, crm_contact_verifications[\s\S]*FROM authenticated, service_role/,
    );
    expect(migration).toContain("crm_contacts_invalidate_changed_verification");
    expect(migration).toContain("NEW.verification_status := 'unverified'");
    expect(migration).toContain("verified contacts require the controlled verification workflow");
    expect(migration).toContain("company.client_id = NEW.client_id");
  });
});
