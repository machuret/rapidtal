-- ============================================================
-- 030_lead_engine_completion.sql
-- Complete the reviewed lead-engine contract:
-- - atomic canonical/source/content identities;
-- - enrichment and scoring before final review;
-- - target-page redirect/status telemetry.
-- Run after 029_phase_7_hardening.sql.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'job_ads_client_id_id_key'
      AND conrelid = 'public.job_ads'::regclass
  ) THEN
    ALTER TABLE job_ads
      ADD CONSTRAINT job_ads_client_id_id_key UNIQUE (client_id, id);
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS job_ad_identities (
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  identity_type   TEXT NOT NULL CHECK (
                    identity_type IN ('canonical_url', 'source_job_id', 'content_fingerprint')
                  ),
  identity_value  TEXT NOT NULL CHECK (length(identity_value) BETWEEN 1 AND 4096),
  job_ad_id       UUID NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (client_id, identity_type, identity_value),
  CONSTRAINT job_ad_identities_tenant_job_fkey
    FOREIGN KEY (client_id, job_ad_id)
    REFERENCES job_ads(client_id, id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS job_ad_identities_job_idx
  ON job_ad_identities (job_ad_id);

ALTER TABLE job_ad_identities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_ad_identities_super_admin_select" ON job_ad_identities;
CREATE POLICY "job_ad_identities_super_admin_select"
  ON job_ad_identities FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "job_ad_identities_own_client_select" ON job_ad_identities;
CREATE POLICY "job_ad_identities_own_client_select"
  ON job_ad_identities FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

GRANT SELECT ON job_ad_identities TO authenticated, service_role;
REVOKE INSERT, UPDATE, DELETE ON job_ad_identities FROM authenticated, service_role;

INSERT INTO job_ad_identities (
  client_id, identity_type, identity_value, job_ad_id
)
SELECT client_id, 'canonical_url', canonical_url, id
FROM job_ads
ON CONFLICT DO NOTHING;

INSERT INTO job_ad_identities (
  client_id, identity_type, identity_value, job_ad_id
)
SELECT DISTINCT ON (client_id, source_host, btrim(source_job_id))
  client_id,
  'source_job_id',
  source_host || ':' || btrim(source_job_id),
  id
FROM job_ads
WHERE NULLIF(btrim(source_job_id), '') IS NOT NULL
ORDER BY client_id, source_host, btrim(source_job_id), created_at, id
ON CONFLICT DO NOTHING;

INSERT INTO job_ad_identities (
  client_id, identity_type, identity_value, job_ad_id
)
SELECT DISTINCT ON (client_id, raw_content_hash)
  client_id,
  'content_fingerprint',
  raw_content_hash,
  id
FROM job_ads
WHERE NULLIF(raw_content_hash, '') IS NOT NULL
ORDER BY client_id, raw_content_hash, created_at, id
ON CONFLICT DO NOTHING;

ALTER TABLE job_scrape_runs
  ADD COLUMN IF NOT EXISTS final_url TEXT,
  ADD COLUMN IF NOT EXISTS redirect_history JSONB NOT NULL DEFAULT '[]'::JSONB;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'job_scrape_runs_final_url_https'
      AND conrelid = 'public.job_scrape_runs'::regclass
  ) THEN
    ALTER TABLE job_scrape_runs
      ADD CONSTRAINT job_scrape_runs_final_url_https CHECK (
        final_url IS NULL OR final_url ~ '^https://'
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'job_scrape_runs_redirect_history_array'
      AND conrelid = 'public.job_scrape_runs'::regclass
  ) THEN
    ALTER TABLE job_scrape_runs
      ADD CONSTRAINT job_scrape_runs_redirect_history_array CHECK (
        jsonb_typeof(redirect_history) = 'array'
        AND jsonb_array_length(redirect_history) <= 20
      );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION upsert_job_ad_extraction(
  p_actor_id UUID,
  p_client_id UUID,
  p_payload JSONB
)
RETURNS SETOF job_ads
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_existing job_ads%ROWTYPE;
  v_saved job_ads%ROWTYPE;
  v_status TEXT := 'needs_review';
  v_keep_review BOOLEAN := false;
  v_canonical_url TEXT := p_payload->>'canonical_url';
  v_source_host TEXT := p_payload->>'source_host';
  v_source_job_id TEXT := NULLIF(btrim(p_payload->>'source_job_id'), '');
  v_content_hash TEXT := p_payload->>'raw_content_hash';
  v_extraction_hash TEXT := p_payload->>'extraction_hash';
  v_source_identity TEXT;
  v_lock_key TEXT;
  v_identity_job_id UUID;
  v_identity_job_count INTEGER;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_payload IS NULL
     OR jsonb_typeof(p_payload) <> 'object'
     OR NULLIF(v_canonical_url, '') IS NULL
     OR NULLIF(v_source_host, '') IS NULL
     OR NULLIF(v_content_hash, '') IS NULL
     OR NULLIF(v_extraction_hash, '') IS NULL THEN
    RAISE EXCEPTION 'invalid job extraction payload' USING ERRCODE = '22023';
  END IF;

  SELECT role, client_id
    INTO v_actor_role, v_actor_client_id
  FROM users
  WHERE id = p_actor_id;

  IF v_actor_role IS NULL
     OR v_actor_role NOT IN ('super_admin', 'client_admin')
     OR (v_actor_role <> 'super_admin' AND v_actor_client_id IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  v_source_identity := CASE
    WHEN v_source_job_id IS NULL THEN NULL
    ELSE v_source_host || ':' || v_source_job_id
  END;

  -- Lock every incoming identity in stable order so concurrent aliases cannot
  -- produce duplicate jobs or deadlock each other.
  FOR v_lock_key IN
    SELECT key
    FROM unnest(ARRAY[
      'canonical_url:' || v_canonical_url,
      CASE WHEN v_source_identity IS NULL
        THEN NULL ELSE 'source_job_id:' || v_source_identity END,
      'content_fingerprint:' || v_content_hash
    ]) AS incoming(key)
    WHERE key IS NOT NULL
    ORDER BY key
  LOOP
    PERFORM pg_advisory_xact_lock(
      hashtextextended(p_client_id::TEXT || ':job-identity:' || v_lock_key, 0)
    );
  END LOOP;

  SELECT
    count(DISTINCT identity.job_ad_id),
    (array_agg(DISTINCT identity.job_ad_id))[1]
    INTO v_identity_job_count, v_identity_job_id
  FROM job_ad_identities AS identity
  WHERE identity.client_id = p_client_id
    AND (
      (
        identity.identity_type = 'canonical_url'
        AND identity.identity_value = v_canonical_url
      )
      OR (
        v_source_identity IS NOT NULL
        AND identity.identity_type = 'source_job_id'
        AND identity.identity_value = v_source_identity
      )
      OR (
        identity.identity_type = 'content_fingerprint'
        AND identity.identity_value = v_content_hash
      )
    );

  IF v_identity_job_count > 1 THEN
    RAISE EXCEPTION 'job identities resolve to conflicting records'
      USING ERRCODE = '23505';
  END IF;

  IF v_identity_job_id IS NOT NULL THEN
    SELECT * INTO v_existing
    FROM job_ads
    WHERE id = v_identity_job_id AND client_id = p_client_id
    FOR UPDATE;
  ELSE
    SELECT * INTO v_existing
    FROM job_ads
    WHERE client_id = p_client_id
      AND canonical_url = v_canonical_url
    FOR UPDATE;
  END IF;

  IF FOUND THEN
    IF v_existing.status IN ('approved', 'rejected')
       AND v_existing.reviewed_content_hash = v_content_hash
       AND v_existing.reviewed_extraction_hash = v_extraction_hash THEN
      v_status := v_existing.status;
      v_keep_review := true;
    ELSIF v_existing.status = 'expired'
          AND v_existing.raw_content_hash = v_content_hash
          AND v_existing.extraction_hash = v_extraction_hash THEN
      v_status := 'expired';
    END IF;

    UPDATE job_ads
    SET
      source_url = p_payload->>'source_url',
      source_host = v_source_host,
      source_job_id = v_source_job_id,
      title = p_payload->>'title',
      company_name = NULLIF(p_payload->>'company_name', ''),
      company_website = NULLIF(p_payload->>'company_website', ''),
      location = NULLIF(p_payload->>'location', ''),
      remote_type = p_payload->>'remote_type',
      employment_type = NULLIF(p_payload->>'employment_type', ''),
      salary_min = NULLIF(p_payload->>'salary_min', '')::NUMERIC,
      salary_max = NULLIF(p_payload->>'salary_max', '')::NUMERIC,
      salary_currency = NULLIF(p_payload->>'salary_currency', ''),
      salary_period = NULLIF(p_payload->>'salary_period', ''),
      description = p_payload->>'description',
      responsibilities = ARRAY(
        SELECT jsonb_array_elements_text(COALESCE(p_payload->'responsibilities', '[]'::JSONB))
      ),
      skills = ARRAY(
        SELECT jsonb_array_elements_text(COALESCE(p_payload->'skills', '[]'::JSONB))
      ),
      posted_at = NULLIF(p_payload->>'posted_at', '')::TIMESTAMPTZ,
      expires_at = NULLIF(p_payload->>'expires_at', '')::TIMESTAMPTZ,
      apply_url = NULLIF(p_payload->>'apply_url', ''),
      raw_content = p_payload->>'raw_content',
      raw_content_hash = v_content_hash,
      extraction_hash = v_extraction_hash,
      extraction_method = p_payload->>'extraction_method',
      extraction_confidence = (p_payload->>'extraction_confidence')::NUMERIC,
      field_evidence = COALESCE(p_payload->'field_evidence', '{}'::JSONB),
      status = v_status,
      reviewed_by = CASE WHEN v_keep_review THEN v_existing.reviewed_by ELSE NULL END,
      reviewed_at = CASE WHEN v_keep_review THEN v_existing.reviewed_at ELSE NULL END,
      reviewed_content_hash =
        CASE WHEN v_keep_review THEN v_existing.reviewed_content_hash ELSE NULL END,
      reviewed_extraction_hash =
        CASE WHEN v_keep_review THEN v_existing.reviewed_extraction_hash ELSE NULL END,
      updated_at = now(),
      last_seen_at = now()
    WHERE id = v_existing.id
    RETURNING * INTO v_saved;
  ELSE
    INSERT INTO job_ads (
      client_id, source_url, canonical_url, source_host, source_job_id,
      title, company_name, company_website, location, remote_type,
      employment_type, salary_min, salary_max, salary_currency, salary_period,
      description, responsibilities, skills, posted_at, expires_at, apply_url,
      raw_content, raw_content_hash, extraction_hash, extraction_method,
      extraction_confidence, field_evidence, status, created_by
    )
    VALUES (
      p_client_id,
      p_payload->>'source_url',
      v_canonical_url,
      v_source_host,
      v_source_job_id,
      p_payload->>'title',
      NULLIF(p_payload->>'company_name', ''),
      NULLIF(p_payload->>'company_website', ''),
      NULLIF(p_payload->>'location', ''),
      p_payload->>'remote_type',
      NULLIF(p_payload->>'employment_type', ''),
      NULLIF(p_payload->>'salary_min', '')::NUMERIC,
      NULLIF(p_payload->>'salary_max', '')::NUMERIC,
      NULLIF(p_payload->>'salary_currency', ''),
      NULLIF(p_payload->>'salary_period', ''),
      p_payload->>'description',
      ARRAY(
        SELECT jsonb_array_elements_text(COALESCE(p_payload->'responsibilities', '[]'::JSONB))
      ),
      ARRAY(
        SELECT jsonb_array_elements_text(COALESCE(p_payload->'skills', '[]'::JSONB))
      ),
      NULLIF(p_payload->>'posted_at', '')::TIMESTAMPTZ,
      NULLIF(p_payload->>'expires_at', '')::TIMESTAMPTZ,
      NULLIF(p_payload->>'apply_url', ''),
      p_payload->>'raw_content',
      v_content_hash,
      v_extraction_hash,
      p_payload->>'extraction_method',
      (p_payload->>'extraction_confidence')::NUMERIC,
      COALESCE(p_payload->'field_evidence', '{}'::JSONB),
      'needs_review',
      p_actor_id
    )
    RETURNING * INTO v_saved;
  END IF;

  INSERT INTO job_ad_identities (
    client_id, identity_type, identity_value, job_ad_id
  )
  VALUES
    (p_client_id, 'canonical_url', v_canonical_url, v_saved.id),
    (p_client_id, 'content_fingerprint', v_content_hash, v_saved.id)
  ON CONFLICT DO NOTHING;

  IF v_source_identity IS NOT NULL THEN
    INSERT INTO job_ad_identities (
      client_id, identity_type, identity_value, job_ad_id
    )
    VALUES (p_client_id, 'source_job_id', v_source_identity, v_saved.id)
    ON CONFLICT DO NOTHING;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM job_ad_identities AS identity
    WHERE identity.client_id = p_client_id
      AND identity.job_ad_id <> v_saved.id
      AND (
        (
          identity.identity_type = 'canonical_url'
          AND identity.identity_value = v_canonical_url
        )
        OR (
          v_source_identity IS NOT NULL
          AND identity.identity_type = 'source_job_id'
          AND identity.identity_value = v_source_identity
        )
        OR (
          identity.identity_type = 'content_fingerprint'
          AND identity.identity_value = v_content_hash
        )
      )
  ) THEN
    RAISE EXCEPTION 'job identity was claimed concurrently'
      USING ERRCODE = '23505';
  END IF;

  RETURN NEXT v_saved;
END;
$$;

REVOKE ALL ON FUNCTION upsert_job_ad_extraction(UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION upsert_job_ad_extraction(UUID, UUID, JSONB)
  TO service_role;

-- All job writes now pass through SECURITY DEFINER functions that preserve
-- review state, expiry, lifecycle events, recrawl state, and identities.
REVOKE INSERT, UPDATE, DELETE ON job_ads FROM service_role;

-- Phase 3 and 4 are evidence-building stages. They may run while a valid job
-- and company await final review; Phase 5 promotion remains approval-gated.
DO $migration$
DECLARE
  v_definition TEXT;
  v_patched TEXT;
BEGIN
  SELECT pg_get_functiondef(
    'public.begin_company_enrichment_run(uuid,uuid,uuid,text,text,text)'::regprocedure
  ) INTO v_definition;
  v_patched := replace(
    v_definition,
    'AND status = ''approved''',
    'AND status IN (''extracted'', ''needs_review'', ''approved'')'
  );
  IF v_patched = v_definition THEN
    RAISE EXCEPTION 'begin_company_enrichment_run eligibility patch did not apply';
  END IF;
  EXECUTE v_patched;

  SELECT pg_get_functiondef(
    'public.upsert_lead_company_enrichment(uuid,uuid,uuid,uuid,jsonb)'::regprocedure
  ) INTO v_definition;
  v_patched := replace(
    v_definition,
    'AND status = ''approved''',
    'AND status IN (''extracted'', ''needs_review'', ''approved'')'
  );
  IF v_patched = v_definition THEN
    RAISE EXCEPTION 'upsert_lead_company_enrichment eligibility patch did not apply';
  END IF;
  EXECUTE v_patched;

  SELECT pg_get_functiondef(
    'public.reuse_lead_company(uuid,uuid,uuid,uuid,uuid)'::regprocedure
  ) INTO v_definition;
  v_patched := replace(
    v_definition,
    'status = ''approved''',
    'status IN (''extracted'', ''needs_review'', ''approved'')'
  );
  IF v_patched = v_definition THEN
    RAISE EXCEPTION 'reuse_lead_company eligibility patch did not apply';
  END IF;
  EXECUTE v_patched;

  SELECT pg_get_functiondef(
    'public.save_transparent_lead_score(uuid,uuid,uuid,jsonb)'::regprocedure
  ) INTO v_definition;
  v_patched := replace(
    v_definition,
    'v_job.status <> ''approved''',
    'v_job.status NOT IN (''extracted'', ''needs_review'', ''approved'')'
  );
  v_patched := replace(
    v_patched,
    'v_company.status <> ''approved''',
    'v_company.status NOT IN (''needs_review'', ''approved'')'
  );
  IF v_patched = v_definition THEN
    RAISE EXCEPTION 'save_transparent_lead_score eligibility patch did not apply';
  END IF;
  EXECUTE v_patched;
END;
$migration$;

COMMENT ON TABLE job_ad_identities IS
  'Atomic tenant-scoped aliases for canonical URL, source job ID, and exact content fingerprint.';
COMMENT ON COLUMN job_scrape_runs.http_status IS
  'HTTP status reported for the fetched target page, not the provider dataset API.';
COMMENT ON COLUMN job_scrape_runs.final_url IS
  'Credential-free final public HTTPS page URL after redirects.';
COMMENT ON COLUMN job_scrape_runs.redirect_history IS
  'Credential-free ordered public HTTPS redirect chain reported by the page provider.';

SELECT jsonb_build_object(
  'migration_complete', true,
  'installed_tables', ARRAY['job_ad_identities'],
  'installed_functions', ARRAY[
    'upsert_job_ad_extraction',
    'begin_company_enrichment_run',
    'upsert_lead_company_enrichment',
    'reuse_lead_company',
    'save_transparent_lead_score'
  ],
  'hardening', ARRAY[
    'atomic_multi_key_job_identity',
    'pre_review_enrichment_and_scoring',
    'target_page_redirect_telemetry'
  ]
) AS rapidtal_lead_engine_completion_result;
