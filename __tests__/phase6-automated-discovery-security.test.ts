/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(
  join(process.cwd(), "db/migrations/027_automated_job_discovery.sql"),
  "utf8",
);
const worker = readFileSync(
  join(process.cwd(), "supabase/functions/job-ad-discover/index.ts"),
  "utf8",
);
const provider = readFileSync(
  join(
    process.cwd(),
    "supabase/functions/_shared/job-discovery-provider.ts",
  ),
  "utf8",
);
const cron = readFileSync(
  join(process.cwd(), "app/api/cron/job-discovery/route.ts"),
  "utf8",
);
const vercel = JSON.parse(
  readFileSync(join(process.cwd(), "vercel.json"), "utf8"),
) as { crons?: { path: string; schedule: string }[] };

describe("Phase 6 automated discovery security", () => {
  test("source automation is closed by default and requires recorded authorization", () => {
    expect(migration.match(/false, 25,/g)).toHaveLength(3);
    expect(migration).toContain("job_source_access_policy_approval_contract");
    expect(migration).toContain("'written_permission'");
    expect(migration).toContain("'official_api'");
    expect(migration).toContain("'robots_permitted'");
    expect(migration).toContain("super admin required");
    expect(migration).toContain(
      "'automation_default', 'disabled_until_source_authorization_is_recorded'",
    );
  });

  test("claims are leased, concurrency limited, and stale work is recovered", () => {
    expect(migration).toContain("FOR UPDATE OF search SKIP LOCKED");
    expect(migration).toContain("p_limit NOT BETWEEN 1 AND 2");
    expect(migration).toContain("lease_expires_at = now() + interval '15 minutes'");
    expect(migration).toContain("error_code = 'stale_scheduled_run'");
    expect(cron).toContain("p_limit: 2");
  });

  test("failures use bounded exponential backoff", () => {
    expect(migration).toContain("consecutive_failures");
    expect(migration).toMatch(/300 \* power\(2,/);
    expect(migration).toContain("LEAST(86400");
    expect(migration).toContain("p_retry_after_seconds");
  });

  test("expiry requires complete snapshots and three misses", () => {
    expect(migration).toContain("IF p_complete_snapshot THEN");
    expect(migration).toContain("missed_run_count + 1 >= 3");
    expect(migration).toContain("'missing_from_three_complete_runs'");
    expect(provider).toContain("isCompleteDiscoverySnapshot(");
    expect(worker).toContain("p_complete_snapshot: completeSnapshot");
  });

  test("review decisions survive automated metadata refresh", () => {
    const refresh = migration.slice(
      migration.indexOf("UPDATE job_discoveries existing"),
      migration.indexOf("INSERT INTO job_discovery_lifecycle_events", migration.indexOf("UPDATE job_discoveries existing")),
    );
    expect(refresh).not.toMatch(/\bstatus\s*=/);
    expect(refresh).not.toMatch(/\bjob_ad_id\s*=/);
    expect(refresh).toContain("content_fingerprint = incoming.content_fingerprint");
  });

  test("the worker refuses credentials, login walls, and CAPTCHA challenges", () => {
    expect(provider).toContain("isPublicDiscoveryActorInput(actorInput)");
    expect(provider).toContain("discoveryAccessBarrier(dataset)");
    expect(provider).toContain('"source_access_blocked"');
    expect(provider).toContain("86_400");
    expect(provider).toContain("maxTotalChargeUsd=");
    expect(provider).toContain("maxItems=");
  });

  test("the cron endpoint requires its secret and only calls the service worker", () => {
    expect(cron).toContain("timingSafeEqual");
    expect(cron).toContain("process.env.CRON_SECRET");
    expect(cron).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(cron).toContain('trigger: "scheduled"');
    expect(vercel.crons).toContainEqual({
      path: "/api/cron/job-discovery",
      schedule: "0 * * * *",
    });
  });
});
