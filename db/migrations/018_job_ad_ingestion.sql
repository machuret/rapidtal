-- ============================================================
-- 018_job_ad_ingestion.sql
-- Phase 1: tenant-scoped, single-URL job-ad ingestion.
-- Run after 017_security_hardening.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS job_ads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  source_url            TEXT NOT NULL,
  canonical_url         TEXT NOT NULL,
  source_host           TEXT NOT NULL,
  source_job_id         TEXT,
  title                 TEXT NOT NULL,
  company_name          TEXT,
  company_website       TEXT,
  location              TEXT,
  remote_type           TEXT NOT NULL DEFAULT 'unknown'
                          CHECK (remote_type IN ('onsite', 'hybrid', 'remote', 'unknown')),
  employment_type       TEXT,
  salary_min            NUMERIC(14,2),
  salary_max            NUMERIC(14,2),
  salary_currency       TEXT,
  salary_period         TEXT,
  description           TEXT NOT NULL,
  responsibilities      TEXT[] NOT NULL DEFAULT '{}',
  skills                TEXT[] NOT NULL DEFAULT '{}',
  posted_at             TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ,
  apply_url             TEXT,
  raw_content           TEXT NOT NULL,
  raw_content_hash      TEXT NOT NULL,
  extraction_method     TEXT NOT NULL
                          CHECK (extraction_method IN ('json_ld', 'ai', 'json_ld+ai')),
  extraction_confidence NUMERIC(4,3) NOT NULL DEFAULT 0
                          CHECK (extraction_confidence >= 0 AND extraction_confidence <= 1),
  field_evidence        JSONB NOT NULL DEFAULT '{}'::jsonb,
  status                TEXT NOT NULL DEFAULT 'needs_review'
                          CHECK (status IN (
                            'discovered',
                            'extracted',
                            'needs_review',
                            'approved',
                            'rejected',
                            'expired',
                            'error'
                          )),
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT job_ads_client_canonical_url_key UNIQUE (client_id, canonical_url),
  CONSTRAINT job_ads_salary_order_check
    CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
);

CREATE INDEX IF NOT EXISTS job_ads_client_status_updated_idx
  ON job_ads (client_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS job_ads_client_company_idx
  ON job_ads (client_id, lower(company_name))
  WHERE company_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS job_ads_content_hash_idx
  ON job_ads (client_id, raw_content_hash);

CREATE TABLE IF NOT EXISTS job_scrape_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_ad_id         UUID REFERENCES job_ads(id) ON DELETE SET NULL,
  requested_url     TEXT NOT NULL,
  canonical_url     TEXT,
  status            TEXT NOT NULL DEFAULT 'running'
                      CHECK (status IN ('running', 'completed', 'failed')),
  provider          TEXT NOT NULL DEFAULT 'firecrawl',
  extraction_method TEXT,
  http_status       INTEGER,
  tokens_used       INTEGER NOT NULL DEFAULT 0,
  duration_ms       INTEGER,
  error_code        TEXT,
  error_message     TEXT,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS job_scrape_runs_client_started_idx
  ON job_scrape_runs (client_id, started_at DESC);

CREATE INDEX IF NOT EXISTS job_scrape_runs_job_ad_idx
  ON job_scrape_runs (job_ad_id, started_at DESC)
  WHERE job_ad_id IS NOT NULL;

ALTER TABLE job_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_scrape_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_ads_super_admin_all" ON job_ads;
CREATE POLICY "job_ads_super_admin_all"
  ON job_ads FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "job_ads_own_client_select" ON job_ads;
CREATE POLICY "job_ads_own_client_select"
  ON job_ads FOR SELECT
  USING (client_id = current_user_client_id());

DROP POLICY IF EXISTS "job_ads_client_admin_update" ON job_ads;
CREATE POLICY "job_ads_client_admin_update"
  ON job_ads FOR UPDATE
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  )
  WITH CHECK (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

DROP POLICY IF EXISTS "job_scrape_runs_super_admin_all" ON job_scrape_runs;
CREATE POLICY "job_scrape_runs_super_admin_all"
  ON job_scrape_runs FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "job_scrape_runs_own_client_select" ON job_scrape_runs;
CREATE POLICY "job_scrape_runs_own_client_select"
  ON job_scrape_runs FOR SELECT
  USING (client_id = current_user_client_id());

GRANT SELECT, UPDATE ON TABLE job_ads TO authenticated;
GRANT SELECT ON TABLE job_scrape_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE job_ads TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE job_scrape_runs TO service_role;
