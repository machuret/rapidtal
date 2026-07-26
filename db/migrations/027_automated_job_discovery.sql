-- ============================================================
-- 027_automated_job_discovery.sql
-- Phase 6: compliance-gated scheduled discovery, incremental
-- sightings, change/expiry detection, leases, and backoff.
-- Run after 026_phase_5_hardening.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS job_source_access_policies (
  source                     TEXT PRIMARY KEY
                               CHECK (source IN ('seek', 'indeed', 'linkedin')),
  adapter_version            TEXT NOT NULL CHECK (length(adapter_version) BETWEEN 1 AND 50),
  policy_version             TEXT NOT NULL CHECK (length(policy_version) BETWEEN 1 AND 100),
  terms_url                  TEXT NOT NULL CHECK (terms_url ~ '^https://'),
  allowed_hosts              TEXT[] NOT NULL CHECK (cardinality(allowed_hosts) > 0),
  blocked_path_prefixes      TEXT[] NOT NULL DEFAULT ARRAY[
                                 '/login', '/authwall', '/checkpoint',
                                 '/captcha', '/challenge'
                               ]::TEXT[],
  scheduled_access_enabled   BOOLEAN NOT NULL DEFAULT false,
  authorization_basis        TEXT CHECK (
                               authorization_basis IS NULL
                               OR authorization_basis IN (
                                 'written_permission',
                                 'official_api',
                                 'robots_permitted'
                               )
                             ),
  authorization_reference    TEXT,
  max_results_per_run        INTEGER NOT NULL DEFAULT 25
                               CHECK (max_results_per_run BETWEEN 10 AND 50),
  min_interval_minutes       INTEGER NOT NULL DEFAULT 360
                               CHECK (min_interval_minutes BETWEEN 60 AND 10080),
  approved_by                UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at                TIMESTAMPTZ,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT job_source_access_policy_approval_contract CHECK (
    (
      scheduled_access_enabled = false
    )
    OR (
      authorization_basis IS NOT NULL
      AND length(btrim(authorization_reference)) BETWEEN 3 AND 2000
      AND approved_by IS NOT NULL
      AND approved_at IS NOT NULL
    )
  )
);

INSERT INTO job_source_access_policies (
  source, adapter_version, policy_version, terms_url, allowed_hosts,
  scheduled_access_enabled, max_results_per_run, min_interval_minutes
)
VALUES
  (
    'seek', 'phase6-v1', 'seek-review-2026-07-26',
    'https://www.seek.com.au/content/terms/new-advertising-terms-seek-au.pdf',
    ARRAY['seek.com.au'], false, 25, 360
  ),
  (
    'indeed', 'phase6-v1', 'indeed-terms-2026-07-17',
    'https://www.indeed.com/legal?hl=en_US',
    ARRAY['indeed.com', 'indeed.com.au'], false, 25, 360
  ),
  (
    'linkedin', 'phase6-v1', 'linkedin-user-agreement-2025-11-03',
    'https://www.linkedin.com/legal/user-agreement',
    ARRAY['linkedin.com'], false, 25, 1440
  )
ON CONFLICT (source) DO NOTHING;

ALTER TABLE job_searches
  ADD COLUMN IF NOT EXISTS schedule_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS schedule_interval_minutes INTEGER NOT NULL DEFAULT 1440,
  ADD COLUMN IF NOT EXISTS next_run_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS backoff_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consecutive_failures INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_success_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_scheduled_run_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS schedule_approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS schedule_approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS compliance_policy_version TEXT,
  ADD COLUMN IF NOT EXISTS lease_owner UUID,
  ADD COLUMN IF NOT EXISTS lease_token UUID,
  ADD COLUMN IF NOT EXISTS lease_expires_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'job_searches_schedule_interval_limit'
      AND conrelid = 'public.job_searches'::regclass
  ) THEN
    ALTER TABLE job_searches
      ADD CONSTRAINT job_searches_schedule_interval_limit CHECK (
        schedule_interval_minutes BETWEEN 60 AND 10080
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'job_searches_failure_count_limit'
      AND conrelid = 'public.job_searches'::regclass
  ) THEN
    ALTER TABLE job_searches
      ADD CONSTRAINT job_searches_failure_count_limit CHECK (
        consecutive_failures BETWEEN 0 AND 20
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'job_searches_schedule_approval_contract'
      AND conrelid = 'public.job_searches'::regclass
  ) THEN
    ALTER TABLE job_searches
      ADD CONSTRAINT job_searches_schedule_approval_contract CHECK (
        schedule_enabled = false
        OR (
          schedule_approved_by IS NOT NULL
          AND schedule_approved_at IS NOT NULL
          AND compliance_policy_version IS NOT NULL
          AND next_run_at IS NOT NULL
        )
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'job_searches_lease_contract'
      AND conrelid = 'public.job_searches'::regclass
  ) THEN
    ALTER TABLE job_searches
      ADD CONSTRAINT job_searches_lease_contract CHECK (
        (lease_owner IS NULL AND lease_token IS NULL AND lease_expires_at IS NULL)
        OR (
          lease_owner IS NOT NULL
          AND lease_token IS NOT NULL
          AND lease_expires_at IS NOT NULL
        )
      );
  END IF;
END;
$$;

ALTER TABLE job_discovery_runs
  ADD COLUMN IF NOT EXISTS trigger_type TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS lease_token UUID,
  ADD COLUMN IF NOT EXISTS adapter_version TEXT,
  ADD COLUMN IF NOT EXISTS compliance_policy_version TEXT,
  ADD COLUMN IF NOT EXISTS changed_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expired_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS complete_snapshot BOOLEAN NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'job_discovery_runs_trigger_type_check'
      AND conrelid = 'public.job_discovery_runs'::regclass
  ) THEN
    ALTER TABLE job_discovery_runs
      ADD CONSTRAINT job_discovery_runs_trigger_type_check CHECK (
        trigger_type IN ('manual', 'scheduled')
      );
  END IF;
END;
$$;

ALTER TABLE job_discoveries
  ADD COLUMN IF NOT EXISTS listing_state TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS content_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expired_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'job_discoveries_listing_state_check'
      AND conrelid = 'public.job_discoveries'::regclass
  ) THEN
    ALTER TABLE job_discoveries
      ADD CONSTRAINT job_discoveries_listing_state_check CHECK (
        listing_state IN ('active', 'changed', 'expired')
      );
  END IF;
END;
$$;

ALTER TABLE job_ads
  ADD COLUMN IF NOT EXISTS source_listing_state TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS source_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS source_expired_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS recrawl_required BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_recrawled_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'job_ads_source_listing_state_check'
      AND conrelid = 'public.job_ads'::regclass
  ) THEN
    ALTER TABLE job_ads
      ADD CONSTRAINT job_ads_source_listing_state_check CHECK (
        source_listing_state IN ('active', 'changed', 'expired')
      );
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS job_discovery_search_sightings (
  search_id          UUID NOT NULL REFERENCES job_searches(id) ON DELETE CASCADE,
  discovery_id       UUID NOT NULL REFERENCES job_discoveries(id) ON DELETE CASCADE,
  client_id          UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  first_seen_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  missed_run_count   INTEGER NOT NULL DEFAULT 0 CHECK (missed_run_count BETWEEN 0 AND 1000),
  is_expired         BOOLEAN NOT NULL DEFAULT false,
  expired_at         TIMESTAMPTZ,
  PRIMARY KEY (search_id, discovery_id)
);

CREATE TABLE IF NOT EXISTS job_discovery_lifecycle_events (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id            UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  discovery_id         UUID NOT NULL REFERENCES job_discoveries(id) ON DELETE CASCADE,
  discovery_run_id     UUID REFERENCES job_discovery_runs(id) ON DELETE SET NULL,
  from_state           TEXT NOT NULL CHECK (from_state IN ('active', 'changed', 'expired')),
  to_state             TEXT NOT NULL CHECK (to_state IN ('active', 'changed', 'expired')),
  previous_fingerprint TEXT,
  new_fingerprint      TEXT,
  reason               TEXT NOT NULL CHECK (
                         reason IN (
                           'content_changed',
                           'explicit_expiry',
                           'missing_from_three_complete_runs',
                           'recrawl_acknowledged',
                           'listing_reappeared'
                         )
                       ),
  detected_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_searches_due_schedule_idx
  ON job_searches (next_run_at)
  WHERE is_active = true AND schedule_enabled = true;
CREATE INDEX IF NOT EXISTS job_searches_lease_expiry_idx
  ON job_searches (lease_expires_at)
  WHERE lease_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS job_discoveries_client_listing_state_idx
  ON job_discoveries (client_id, listing_state, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS job_discovery_sightings_client_expired_idx
  ON job_discovery_search_sightings (client_id, is_expired, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS job_discovery_lifecycle_events_discovery_idx
  ON job_discovery_lifecycle_events (discovery_id, detected_at DESC);

ALTER TABLE job_source_access_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_discovery_search_sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_discovery_lifecycle_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_source_access_policies_super_admin_select"
  ON job_source_access_policies;
CREATE POLICY "job_source_access_policies_super_admin_select"
  ON job_source_access_policies FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "job_discovery_sightings_super_admin_select"
  ON job_discovery_search_sightings;
CREATE POLICY "job_discovery_sightings_super_admin_select"
  ON job_discovery_search_sightings FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "job_discovery_sightings_own_client_select"
  ON job_discovery_search_sightings;
CREATE POLICY "job_discovery_sightings_own_client_select"
  ON job_discovery_search_sightings FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );
DROP POLICY IF EXISTS "job_discovery_lifecycle_super_admin_select"
  ON job_discovery_lifecycle_events;
CREATE POLICY "job_discovery_lifecycle_super_admin_select"
  ON job_discovery_lifecycle_events FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "job_discovery_lifecycle_own_client_select"
  ON job_discovery_lifecycle_events;
CREATE POLICY "job_discovery_lifecycle_own_client_select"
  ON job_discovery_lifecycle_events FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

GRANT SELECT ON
  job_discovery_search_sightings,
  job_discovery_lifecycle_events
  TO authenticated, service_role;
GRANT SELECT ON job_source_access_policies TO service_role;
REVOKE INSERT, UPDATE, DELETE ON
  job_source_access_policies,
  job_discovery_search_sightings,
  job_discovery_lifecycle_events
  FROM authenticated, service_role;

CREATE OR REPLACE FUNCTION approve_job_source_access(
  p_actor_id UUID,
  p_source TEXT,
  p_enabled BOOLEAN,
  p_authorization_basis TEXT,
  p_authorization_reference TEXT,
  p_policy_version TEXT
)
RETURNS SETOF job_source_access_policies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_saved job_source_access_policies%ROWTYPE;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE id = p_actor_id AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'super admin required' USING ERRCODE = '42501';
  END IF;
  IF p_source NOT IN ('seek', 'indeed', 'linkedin')
     OR NULLIF(btrim(p_policy_version), '') IS NULL
     OR (
       p_enabled
       AND (
         p_authorization_basis NOT IN (
           'written_permission', 'official_api', 'robots_permitted'
         )
         OR length(btrim(COALESCE(p_authorization_reference, '')))
              NOT BETWEEN 3 AND 2000
       )
     ) THEN
    RAISE EXCEPTION 'invalid source authorization' USING ERRCODE = '22023';
  END IF;

  UPDATE job_source_access_policies
  SET
    scheduled_access_enabled = p_enabled,
    authorization_basis = CASE WHEN p_enabled THEN p_authorization_basis ELSE NULL END,
    authorization_reference =
      CASE WHEN p_enabled THEN btrim(p_authorization_reference) ELSE NULL END,
    policy_version = btrim(p_policy_version),
    approved_by = CASE WHEN p_enabled THEN p_actor_id ELSE NULL END,
    approved_at = CASE WHEN p_enabled THEN now() ELSE NULL END,
    updated_at = now()
  WHERE source = p_source
  RETURNING * INTO v_saved;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'source policy not found' USING ERRCODE = 'P0002';
  END IF;

  IF NOT p_enabled THEN
    UPDATE job_searches
    SET
      schedule_enabled = false,
      next_run_at = NULL,
      backoff_until = NULL,
      lease_token = NULL,
      lease_owner = NULL,
      lease_expires_at = NULL,
      updated_at = now()
    WHERE source = p_source AND schedule_enabled = true;
  END IF;

  RETURN NEXT v_saved;
END;
$$;

CREATE OR REPLACE FUNCTION configure_job_search_schedule(
  p_actor_id UUID,
  p_client_id UUID,
  p_search_id UUID,
  p_enabled BOOLEAN,
  p_interval_minutes INTEGER
)
RETURNS SETOF job_searches
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor users%ROWTYPE;
  v_search job_searches%ROWTYPE;
  v_policy job_source_access_policies%ROWTYPE;
  v_saved job_searches%ROWTYPE;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_actor FROM users WHERE id = p_actor_id;
  IF NOT FOUND
     OR v_actor.role NOT IN ('super_admin', 'client_admin')
     OR (
       v_actor.role <> 'super_admin'
       AND v_actor.client_id IS DISTINCT FROM p_client_id
     ) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_search
  FROM job_searches
  WHERE id = p_search_id AND client_id = p_client_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'saved search not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_policy
  FROM job_source_access_policies
  WHERE source = v_search.source
  FOR SHARE;
  IF p_enabled AND (
    v_policy.source IS NULL
    OR NOT v_policy.scheduled_access_enabled
    OR v_policy.approved_by IS NULL
    OR v_policy.approved_at IS NULL
    OR p_interval_minutes < v_policy.min_interval_minutes
    OR p_interval_minutes > 10080
    OR v_search.max_results > v_policy.max_results_per_run
  ) THEN
    RAISE EXCEPTION 'source is not approved for this schedule'
      USING ERRCODE = '42501';
  END IF;

  UPDATE job_searches
  SET
    schedule_enabled = p_enabled,
    schedule_interval_minutes =
      CASE WHEN p_enabled THEN p_interval_minutes ELSE schedule_interval_minutes END,
    next_run_at = CASE WHEN p_enabled THEN now() ELSE NULL END,
    backoff_until = NULL,
    consecutive_failures = CASE WHEN p_enabled THEN 0 ELSE consecutive_failures END,
    schedule_approved_by = CASE WHEN p_enabled THEN p_actor_id ELSE NULL END,
    schedule_approved_at = CASE WHEN p_enabled THEN now() ELSE NULL END,
    compliance_policy_version =
      CASE WHEN p_enabled THEN v_policy.policy_version ELSE NULL END,
    lease_token = NULL,
    lease_owner = NULL,
    lease_expires_at = NULL,
    updated_at = now()
  WHERE id = v_search.id
  RETURNING * INTO v_saved;

  RETURN NEXT v_saved;
END;
$$;

CREATE OR REPLACE FUNCTION claim_due_job_searches(
  p_worker_id UUID,
  p_limit INTEGER DEFAULT 2
)
RETURNS TABLE(
  search_id UUID,
  client_id UUID,
  lease_token UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_worker_id IS NULL OR p_limit NOT BETWEEN 1 AND 2 THEN
    RAISE EXCEPTION 'invalid scheduler claim' USING ERRCODE = '22023';
  END IF;

  UPDATE job_discovery_runs
  SET
    status = 'failed',
    error_code = 'stale_scheduled_run',
    error_message = 'The scheduled discovery worker stopped before completing.',
    completed_at = now()
  WHERE trigger_type = 'scheduled'
    AND status = 'running'
    AND started_at <= now() - interval '20 minutes';

  RETURN QUERY
  WITH due AS (
    SELECT search.id
    FROM job_searches search
    JOIN job_source_access_policies policy ON policy.source = search.source
    WHERE search.is_active = true
      AND search.schedule_enabled = true
      AND search.next_run_at <= now()
      AND (search.backoff_until IS NULL OR search.backoff_until <= now())
      AND (
        search.lease_expires_at IS NULL
        OR search.lease_expires_at <= now()
      )
      AND policy.scheduled_access_enabled = true
      AND policy.policy_version = search.compliance_policy_version
      AND search.max_results <= policy.max_results_per_run
      AND search.schedule_interval_minutes >= policy.min_interval_minutes
      AND NOT EXISTS (
        SELECT 1
        FROM job_discovery_runs run
        WHERE run.search_id = search.id
          AND run.status = 'running'
          AND run.started_at > now() - interval '20 minutes'
      )
    ORDER BY search.next_run_at, search.id
    FOR UPDATE OF search SKIP LOCKED
    LIMIT p_limit
  ),
  claimed AS (
    UPDATE job_searches search
    SET
      lease_token = gen_random_uuid(),
      lease_owner = p_worker_id,
      lease_expires_at = now() + interval '15 minutes',
      last_scheduled_run_at = now(),
      updated_at = now()
    FROM due
    WHERE search.id = due.id
    RETURNING search.id, search.client_id, search.lease_token
  )
  SELECT claimed.id, claimed.client_id, claimed.lease_token
  FROM claimed;
END;
$$;

CREATE OR REPLACE FUNCTION begin_scheduled_job_discovery(
  p_search_id UUID,
  p_lease_token UUID
)
RETURNS SETOF job_searches
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_search job_searches%ROWTYPE;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  SELECT search.* INTO v_search
  FROM job_searches search
  JOIN job_source_access_policies policy ON policy.source = search.source
  WHERE search.id = p_search_id
    AND search.schedule_enabled = true
    AND search.is_active = true
    AND search.lease_token = p_lease_token
    AND search.lease_expires_at > now()
    AND policy.scheduled_access_enabled = true
    AND policy.policy_version = search.compliance_policy_version
    AND search.max_results <= policy.max_results_per_run
    AND search.schedule_interval_minutes >= policy.min_interval_minutes
  FOR UPDATE OF search;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'scheduled search lease is invalid' USING ERRCODE = 'P0002';
  END IF;
  RETURN NEXT v_search;
END;
$$;

CREATE OR REPLACE FUNCTION finish_job_search_schedule(
  p_search_id UUID,
  p_lease_token UUID,
  p_succeeded BOOLEAN,
  p_retry_after_seconds INTEGER DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_search job_searches%ROWTYPE;
  v_failures INTEGER;
  v_backoff_seconds INTEGER;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO v_search
  FROM job_searches
  WHERE id = p_search_id
    AND lease_token = p_lease_token
  FOR UPDATE;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF p_succeeded THEN
    UPDATE job_searches
    SET
      consecutive_failures = 0,
      backoff_until = NULL,
      last_success_at = now(),
      next_run_at = now() + make_interval(mins => schedule_interval_minutes),
      lease_token = NULL,
      lease_owner = NULL,
      lease_expires_at = NULL,
      updated_at = now()
    WHERE id = v_search.id;
  ELSE
    v_failures := LEAST(20, v_search.consecutive_failures + 1);
    v_backoff_seconds := GREATEST(
      COALESCE(p_retry_after_seconds, 0),
      LEAST(86400, (300 * power(2, LEAST(v_failures - 1, 8)))::INTEGER)
    );
    UPDATE job_searches
    SET
      consecutive_failures = v_failures,
      backoff_until = now() + make_interval(secs => v_backoff_seconds),
      next_run_at = now() + make_interval(secs => v_backoff_seconds),
      lease_token = NULL,
      lease_owner = NULL,
      lease_expires_at = NULL,
      updated_at = now()
    WHERE id = v_search.id;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION upsert_job_discoveries_v2(
  p_client_id UUID,
  p_run_id UUID,
  p_items JSONB,
  p_complete_snapshot BOOLEAN
)
RETURNS TABLE(
  result_count INTEGER,
  new_count INTEGER,
  changed_count INTEGER,
  expired_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_run job_discovery_runs%ROWTYPE;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_items IS NULL
     OR jsonb_typeof(p_items) <> 'array'
     OR jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'invalid discovery payload' USING ERRCODE = '22023';
  END IF;
  SELECT * INTO v_run
  FROM job_discovery_runs
  WHERE id = p_run_id
    AND client_id = p_client_id
    AND status = 'running'
    AND search_id IS NOT NULL
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'discovery run not found' USING ERRCODE = 'P0002';
  END IF;

  -- PostgREST normally gives each RPC its own transaction, but explicitly
  -- clear our session-local work tables so repeated calls in one transaction
  -- remain safe for maintenance scripts and tests.
  DROP TABLE IF EXISTS pg_temp.phase6_expired;
  DROP TABLE IF EXISTS pg_temp.phase6_reappeared;
  DROP TABLE IF EXISTS pg_temp.phase6_changes;
  DROP TABLE IF EXISTS pg_temp.phase6_incoming_discoveries;

  IF EXISTS (
    SELECT 1
    FROM jsonb_to_recordset(p_items) AS item(
      source TEXT, canonical_url TEXT, job_url TEXT, title TEXT,
      content_fingerprint TEXT
    )
    WHERE item.source IS DISTINCT FROM v_run.source
       OR NULLIF(item.canonical_url, '') IS NULL
       OR NULLIF(item.job_url, '') IS NULL
       OR NULLIF(item.title, '') IS NULL
       OR NULLIF(item.content_fingerprint, '') IS NULL
       OR item.content_fingerprint !~ '^[0-9a-f]{16}$'
  ) THEN
    RAISE EXCEPTION 'invalid discovery item' USING ERRCODE = '22023';
  END IF;

  CREATE TEMP TABLE phase6_incoming_discoveries ON COMMIT DROP AS
  SELECT DISTINCT ON (item.canonical_url) item.*
  FROM jsonb_to_recordset(p_items) AS item(
    source TEXT,
    source_job_id TEXT,
    job_url TEXT,
    canonical_url TEXT,
    title TEXT,
    company_name TEXT,
    company_website TEXT,
    location TEXT,
    country TEXT,
    salary_text TEXT,
    work_type TEXT,
    work_arrangement TEXT,
    summary TEXT,
    listed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    content_fingerprint TEXT
  )
  ORDER BY item.canonical_url;

  SELECT count(*)::INTEGER INTO result_count
  FROM phase6_incoming_discoveries;

  CREATE TEMP TABLE phase6_changes ON COMMIT DROP AS
  SELECT
    existing.id AS discovery_id,
    existing.listing_state AS from_state,
    existing.content_fingerprint AS previous_fingerprint,
    incoming.content_fingerprint AS new_fingerprint
  FROM job_discoveries existing
  JOIN phase6_incoming_discoveries incoming
    ON incoming.canonical_url = existing.canonical_url
  WHERE existing.client_id = p_client_id
    AND existing.content_fingerprint IS NOT NULL
    AND existing.content_fingerprint IS DISTINCT FROM incoming.content_fingerprint;

  CREATE TEMP TABLE phase6_reappeared ON COMMIT DROP AS
  SELECT
    existing.id AS discovery_id,
    existing.content_fingerprint
  FROM job_discoveries existing
  JOIN phase6_incoming_discoveries incoming
    ON incoming.canonical_url = existing.canonical_url
  WHERE existing.client_id = p_client_id
    AND existing.listing_state = 'expired'
    AND (incoming.expires_at IS NULL OR incoming.expires_at > now())
    AND existing.content_fingerprint IS NOT DISTINCT FROM incoming.content_fingerprint;

  SELECT count(*)::INTEGER INTO changed_count FROM phase6_changes;

  WITH inserted AS (
    INSERT INTO job_discoveries (
      client_id, discovery_run_id, source, source_job_id, job_url,
      canonical_url, title, company_name, company_website, location,
      country, salary_text, work_type, work_arrangement, summary,
      listed_at, expires_at, status, listing_state, content_fingerprint,
      expired_at
    )
    SELECT
      p_client_id, p_run_id, source, source_job_id, job_url,
      canonical_url, title, company_name, company_website, location,
      country, salary_text, work_type, work_arrangement, summary,
      listed_at, expires_at, 'new',
      CASE WHEN expires_at <= now() THEN 'expired' ELSE 'active' END,
      content_fingerprint,
      CASE WHEN expires_at <= now() THEN now() ELSE NULL END
    FROM phase6_incoming_discoveries
    ON CONFLICT (client_id, canonical_url) DO NOTHING
    RETURNING 1
  )
  SELECT count(*)::INTEGER INTO new_count FROM inserted;

  UPDATE job_discoveries existing
  SET
    discovery_run_id = p_run_id,
    source = incoming.source,
    source_job_id = incoming.source_job_id,
    job_url = incoming.job_url,
    title = incoming.title,
    company_name = incoming.company_name,
    company_website = incoming.company_website,
    location = incoming.location,
    country = incoming.country,
    salary_text = incoming.salary_text,
    work_type = incoming.work_type,
    work_arrangement = incoming.work_arrangement,
    summary = incoming.summary,
    listed_at = incoming.listed_at,
    expires_at = incoming.expires_at,
    content_fingerprint = incoming.content_fingerprint,
    listing_state = CASE
      WHEN incoming.expires_at <= now() THEN 'expired'
      WHEN existing.content_fingerprint IS NOT NULL
           AND existing.content_fingerprint IS DISTINCT FROM incoming.content_fingerprint
        THEN 'changed'
      WHEN existing.listing_state = 'expired' THEN 'active'
      ELSE existing.listing_state
    END,
    changed_at = CASE
      WHEN existing.content_fingerprint IS NOT NULL
           AND existing.content_fingerprint IS DISTINCT FROM incoming.content_fingerprint
        THEN now()
      ELSE existing.changed_at
    END,
    expired_at = CASE
      WHEN incoming.expires_at <= now() THEN COALESCE(existing.expired_at, now())
      WHEN existing.listing_state = 'expired' THEN NULL
      ELSE existing.expired_at
    END,
    last_seen_at = now(),
    updated_at = now()
  FROM phase6_incoming_discoveries incoming
  WHERE existing.client_id = p_client_id
    AND existing.canonical_url = incoming.canonical_url;

  INSERT INTO job_discovery_lifecycle_events (
    client_id, discovery_id, discovery_run_id, from_state, to_state,
    previous_fingerprint, new_fingerprint, reason
  )
  SELECT
    p_client_id, change.discovery_id, p_run_id, change.from_state, 'changed',
    change.previous_fingerprint, change.new_fingerprint, 'content_changed'
  FROM phase6_changes change;

  INSERT INTO job_discovery_lifecycle_events (
    client_id, discovery_id, discovery_run_id, from_state, to_state,
    previous_fingerprint, new_fingerprint, reason
  )
  SELECT
    p_client_id, reappeared.discovery_id, p_run_id, 'expired', 'active',
    reappeared.content_fingerprint, reappeared.content_fingerprint,
    'listing_reappeared'
  FROM phase6_reappeared reappeared;

  INSERT INTO job_discovery_search_sightings (
    search_id, discovery_id, client_id, first_seen_at, last_seen_at,
    missed_run_count, is_expired, expired_at
  )
  SELECT
    v_run.search_id, discovery.id, p_client_id, now(), now(), 0, false, NULL
  FROM job_discoveries discovery
  JOIN phase6_incoming_discoveries incoming
    ON incoming.canonical_url = discovery.canonical_url
  WHERE discovery.client_id = p_client_id
  ON CONFLICT (search_id, discovery_id) DO UPDATE
  SET
    last_seen_at = now(),
    missed_run_count = 0,
    is_expired = false,
    expired_at = NULL;

  IF p_complete_snapshot THEN
    UPDATE job_discovery_search_sightings sighting
    SET
      missed_run_count = LEAST(1000, sighting.missed_run_count + 1),
      is_expired = sighting.missed_run_count + 1 >= 3,
      expired_at = CASE
        WHEN sighting.missed_run_count + 1 >= 3
          THEN COALESCE(sighting.expired_at, now())
        ELSE sighting.expired_at
      END
    WHERE sighting.search_id = v_run.search_id
      AND NOT EXISTS (
        SELECT 1
        FROM job_discoveries discovery
        JOIN phase6_incoming_discoveries incoming
          ON incoming.canonical_url = discovery.canonical_url
        WHERE discovery.id = sighting.discovery_id
          AND discovery.client_id = p_client_id
      );
  END IF;

  CREATE TEMP TABLE phase6_expired ON COMMIT DROP AS
  WITH candidates AS (
    SELECT discovery.id, discovery.listing_state, discovery.content_fingerprint,
      CASE
        WHEN discovery.expires_at <= now() THEN 'explicit_expiry'
        ELSE 'missing_from_three_complete_runs'
      END AS reason
    FROM job_discoveries discovery
    WHERE discovery.client_id = p_client_id
      AND discovery.listing_state <> 'expired'
      AND (
        discovery.expires_at <= now()
        OR (
          EXISTS (
            SELECT 1 FROM job_discovery_search_sightings any_sighting
            WHERE any_sighting.discovery_id = discovery.id
          )
          AND NOT EXISTS (
            SELECT 1 FROM job_discovery_search_sightings active_sighting
            WHERE active_sighting.discovery_id = discovery.id
              AND active_sighting.is_expired = false
          )
        )
      )
  ),
  updated AS (
    UPDATE job_discoveries discovery
    SET listing_state = 'expired', expired_at = now(), updated_at = now()
    FROM candidates
    WHERE discovery.id = candidates.id
    RETURNING
      discovery.id, candidates.listing_state AS from_state,
      discovery.content_fingerprint, candidates.reason
  )
  SELECT * FROM updated;

  SELECT count(*)::INTEGER INTO expired_count FROM phase6_expired;

  INSERT INTO job_discovery_lifecycle_events (
    client_id, discovery_id, discovery_run_id, from_state, to_state,
    previous_fingerprint, new_fingerprint, reason
  )
  SELECT
    p_client_id, expired.id, p_run_id, expired.from_state, 'expired',
    expired.content_fingerprint, expired.content_fingerprint, expired.reason
  FROM phase6_expired expired;

  UPDATE job_ads job
  SET
    source_listing_state = discovery.listing_state,
    source_changed_at = CASE
      WHEN discovery.listing_state = 'changed'
        THEN COALESCE(discovery.changed_at, now())
      ELSE job.source_changed_at
    END,
    source_expired_at = CASE
      WHEN discovery.listing_state = 'expired'
        THEN COALESCE(discovery.expired_at, now())
      WHEN discovery.listing_state = 'active' THEN NULL
      ELSE job.source_expired_at
    END,
    recrawl_required =
      CASE WHEN discovery.listing_state = 'changed' THEN true ELSE job.recrawl_required END,
    updated_at = now()
  FROM job_discoveries discovery
  WHERE discovery.client_id = p_client_id
    AND discovery.job_ad_id = job.id
    AND (
      discovery.discovery_run_id = p_run_id
      OR discovery.id IN (SELECT id FROM phase6_expired)
    );

  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION acknowledge_job_ad_recrawl(
  p_client_id UUID,
  p_job_ad_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  UPDATE job_ads
  SET
    source_listing_state = CASE
      WHEN source_listing_state = 'changed' THEN 'active'
      ELSE source_listing_state
    END,
    recrawl_required = false,
    last_recrawled_at = now(),
    updated_at = now()
  WHERE id = p_job_ad_id AND client_id = p_client_id;

  WITH changed AS (
    UPDATE job_discoveries
    SET listing_state = 'active', changed_at = NULL, updated_at = now()
    WHERE client_id = p_client_id
      AND job_ad_id = p_job_ad_id
      AND listing_state = 'changed'
    RETURNING id, content_fingerprint
  )
  INSERT INTO job_discovery_lifecycle_events (
    client_id, discovery_id, from_state, to_state,
    previous_fingerprint, new_fingerprint, reason
  )
  SELECT
    p_client_id, changed.id, 'changed', 'active',
    changed.content_fingerprint, changed.content_fingerprint,
    'recrawl_acknowledged'
  FROM changed;
END;
$$;

REVOKE ALL ON FUNCTION
  approve_job_source_access(UUID, TEXT, BOOLEAN, TEXT, TEXT, TEXT),
  configure_job_search_schedule(UUID, UUID, UUID, BOOLEAN, INTEGER),
  claim_due_job_searches(UUID, INTEGER),
  begin_scheduled_job_discovery(UUID, UUID),
  finish_job_search_schedule(UUID, UUID, BOOLEAN, INTEGER),
  upsert_job_discoveries_v2(UUID, UUID, JSONB, BOOLEAN),
  acknowledge_job_ad_recrawl(UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION
  approve_job_source_access(UUID, TEXT, BOOLEAN, TEXT, TEXT, TEXT),
  configure_job_search_schedule(UUID, UUID, UUID, BOOLEAN, INTEGER),
  claim_due_job_searches(UUID, INTEGER),
  begin_scheduled_job_discovery(UUID, UUID),
  finish_job_search_schedule(UUID, UUID, BOOLEAN, INTEGER),
  upsert_job_discoveries_v2(UUID, UUID, JSONB, BOOLEAN),
  acknowledge_job_ad_recrawl(UUID, UUID)
  TO service_role;

COMMENT ON TABLE job_source_access_policies IS
  'Closed-by-default authorization registry. Scheduling requires recorded source permission; an available adapter is never authorization.';
COMMENT ON TABLE job_discovery_search_sightings IS
  'Per-search incremental sightings. Three absent complete, non-truncated runs are required before inferred expiry.';
COMMENT ON TABLE job_discovery_lifecycle_events IS
  'Immutable audit history for listing changes, expiry, reappearance, and acknowledged recrawls.';

SELECT json_build_object(
  'migration_complete',
    to_regclass('public.job_source_access_policies') IS NOT NULL
    AND to_regclass('public.job_discovery_search_sightings') IS NOT NULL
    AND to_regclass('public.job_discovery_lifecycle_events') IS NOT NULL
    AND to_regprocedure(
      'public.claim_due_job_searches(uuid,integer)'
    ) IS NOT NULL
    AND to_regprocedure(
      'public.upsert_job_discoveries_v2(uuid,uuid,jsonb,boolean)'
    ) IS NOT NULL,
  'installed_tables', ARRAY[
    'job_source_access_policies',
    'job_discovery_search_sightings',
    'job_discovery_lifecycle_events'
  ],
  'installed_functions', ARRAY[
    'approve_job_source_access',
    'configure_job_search_schedule',
    'claim_due_job_searches',
    'begin_scheduled_job_discovery',
    'finish_job_search_schedule',
    'upsert_job_discoveries_v2',
    'acknowledge_job_ad_recrawl'
  ],
  'automation_default', 'disabled_until_source_authorization_is_recorded'
) AS rapidtal_phase_6_result;
