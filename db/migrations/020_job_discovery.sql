-- ============================================================
-- 020_job_discovery.sql
-- Phase 2: tenant-scoped, multi-source job discovery.
-- Run after 019_job_ad_review_hardening.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS job_searches (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  source            TEXT NOT NULL CHECK (source IN ('seek', 'indeed', 'linkedin')),
  search_term       TEXT NOT NULL CHECK (length(search_term) BETWEEN 2 AND 120),
  location          TEXT NOT NULL DEFAULT '' CHECK (length(location) <= 120),
  country           TEXT NOT NULL DEFAULT 'AU' CHECK (country ~ '^[A-Z]{2}$'),
  work_type         TEXT NOT NULL DEFAULT '' CHECK (length(work_type) <= 50),
  date_range_days   INTEGER NOT NULL DEFAULT 7 CHECK (date_range_days BETWEEN 1 AND 30),
  max_results       INTEGER NOT NULL DEFAULT 25 CHECK (max_results BETWEEN 10 AND 50),
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_run_at       TIMESTAMPTZ,
  CONSTRAINT job_searches_client_definition_key
    UNIQUE (client_id, source, search_term, location, country, work_type, date_range_days)
);

CREATE TABLE IF NOT EXISTS job_discovery_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  search_id         UUID REFERENCES job_searches(id) ON DELETE SET NULL,
  source            TEXT NOT NULL CHECK (source IN ('seek', 'indeed', 'linkedin')),
  search_term       TEXT NOT NULL,
  location          TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL DEFAULT 'running'
                      CHECK (status IN ('running', 'completed', 'failed')),
  provider          TEXT NOT NULL DEFAULT 'apify',
  provider_run_id   TEXT,
  result_count      INTEGER NOT NULL DEFAULT 0 CHECK (result_count >= 0),
  new_count         INTEGER NOT NULL DEFAULT 0 CHECK (new_count >= 0),
  cost_usd          NUMERIC(12,6) NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
  duration_ms       INTEGER,
  error_code        TEXT,
  error_message     TEXT,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at      TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS job_discoveries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  discovery_run_id  UUID REFERENCES job_discovery_runs(id) ON DELETE SET NULL,
  job_ad_id         UUID REFERENCES job_ads(id) ON DELETE SET NULL,
  source            TEXT NOT NULL CHECK (source IN ('seek', 'indeed', 'linkedin')),
  source_job_id     TEXT,
  job_url           TEXT NOT NULL,
  canonical_url     TEXT NOT NULL,
  title             TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 300),
  company_name      TEXT,
  company_website   TEXT,
  location          TEXT,
  country           TEXT,
  salary_text       TEXT,
  work_type         TEXT,
  work_arrangement  TEXT,
  summary           TEXT,
  listed_at         TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ,
  status            TEXT NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new', 'imported', 'dismissed', 'error')),
  discovered_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT job_discoveries_client_canonical_url_key
    UNIQUE (client_id, canonical_url)
);

CREATE INDEX IF NOT EXISTS job_searches_client_updated_idx
  ON job_searches (client_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS job_discovery_runs_client_started_idx
  ON job_discovery_runs (client_id, started_at DESC);
CREATE INDEX IF NOT EXISTS job_discoveries_client_status_seen_idx
  ON job_discoveries (client_id, status, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS job_discoveries_job_ad_idx
  ON job_discoveries (job_ad_id) WHERE job_ad_id IS NOT NULL;

ALTER TABLE job_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_discovery_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_discoveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_searches_super_admin_select" ON job_searches;
CREATE POLICY "job_searches_super_admin_select" ON job_searches FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "job_searches_own_client_select" ON job_searches;
CREATE POLICY "job_searches_own_client_select" ON job_searches FOR SELECT
  USING (client_id = current_user_client_id() AND current_user_role() = 'client_admin');
DROP POLICY IF EXISTS "job_discovery_runs_super_admin_select" ON job_discovery_runs;
CREATE POLICY "job_discovery_runs_super_admin_select" ON job_discovery_runs FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "job_discovery_runs_own_client_select" ON job_discovery_runs;
CREATE POLICY "job_discovery_runs_own_client_select" ON job_discovery_runs FOR SELECT
  USING (client_id = current_user_client_id() AND current_user_role() = 'client_admin');
DROP POLICY IF EXISTS "job_discoveries_super_admin_select" ON job_discoveries;
CREATE POLICY "job_discoveries_super_admin_select" ON job_discoveries FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "job_discoveries_own_client_select" ON job_discoveries;
CREATE POLICY "job_discoveries_own_client_select" ON job_discoveries FOR SELECT
  USING (client_id = current_user_client_id() AND current_user_role() = 'client_admin');

GRANT SELECT ON TABLE job_searches, job_discovery_runs, job_discoveries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE job_searches, job_discovery_runs, job_discoveries TO service_role;
REVOKE INSERT, UPDATE, DELETE
  ON TABLE job_searches, job_discovery_runs, job_discoveries FROM authenticated;

-- Phase 1 imports link matching discoveries without allowing the browser to
-- mutate service-owned discovery state.
CREATE OR REPLACE FUNCTION link_job_discovery(
  p_client_id UUID,
  p_canonical_url TEXT,
  p_job_ad_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;

  UPDATE job_discoveries
  SET job_ad_id = p_job_ad_id, status = 'imported', updated_at = now()
  WHERE client_id = p_client_id AND canonical_url = p_canonical_url;
END;
$$;

REVOKE ALL ON FUNCTION link_job_discovery(UUID, TEXT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION link_job_discovery(UUID, TEXT, UUID) TO service_role;

COMMENT ON TABLE job_discoveries IS
  'Phase 2 discovery queue. Contains public job/company metadata only; no applicant data.';

SELECT json_build_object(
  'migration_complete',
    to_regclass('public.job_searches') IS NOT NULL
    AND to_regclass('public.job_discovery_runs') IS NOT NULL
    AND to_regclass('public.job_discoveries') IS NOT NULL,
  'installed_tables', ARRAY[
    'job_searches',
    'job_discovery_runs',
    'job_discoveries'
  ]
) AS rapidtal_phase_2_result;
