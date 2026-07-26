/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const completion = readFileSync(
  join(process.cwd(), "db/migrations/030_lead_engine_completion.sql"),
  "utf8",
);
const ingestion = readFileSync(
  join(process.cwd(), "supabase/functions/job-ad-ingest/index.ts"),
  "utf8",
);
const vaultUrl = readFileSync(
  join(process.cwd(), "app/api/vault/url/route.ts"),
  "utf8",
);
const vaultUi = readFileSync(
  join(process.cwd(), "components/vault/AddVaultItem.tsx"),
  "utf8",
);
const jobLeads = readFileSync(
  join(process.cwd(), "app/(portal)/job-leads/page.tsx"),
  "utf8",
);
const promotion = readFileSync(
  join(process.cwd(), "db/migrations/025_review_and_crm_promotion.sql"),
  "utf8",
);

describe("lead engine completion contract", () => {
  test("persists target-page status, final URL, and safe redirect history", () => {
    expect(completion).toContain("final_url TEXT");
    expect(completion).toContain("redirect_history JSONB");
    expect(ingestion).toContain("targetHttpStatus = pageContent.statusCode");
    expect(ingestion).toContain("final_url: targetFinalUrl");
    expect(ingestion).toContain("redirect_history: targetRedirectHistory");
  });

  test("keeps the CRM promotion boundary approval-gated", () => {
    expect(promotion).toContain("v_job.status <> 'approved'");
    expect(promotion).toContain("v_company.status <> 'approved'");
    expect(promotion).toContain("v_company.reviewed_by IS NULL");
  });

  test("provides direct retries for all three pipeline stages", () => {
    expect(jobLeads).toContain("RetryScrapeButton");
    expect(jobLeads).toContain("RetryDiscoveryButton");
    expect(jobLeads).toContain("RetryCompanyEnrichmentButton");
  });

  test("formally retires the duplicate Vault reader", () => {
    expect(vaultUrl).toContain("status: 410");
    expect(vaultUrl).toContain("endpoint_retired");
    expect(vaultUrl).toContain('replacement: "/api/vault/crawl"');
    expect(vaultUi).not.toContain('fetch("/api/vault/url"');
    expect(vaultUi).toContain('fetch("/api/vault/crawl"');
  });
});
