-- ============================================================
-- 021_job_pipeline_atomicity.sql
-- Atomic Phase 1 extraction writes and Phase 2 discovery upserts.
-- Run after 020_job_discovery.sql.
-- ============================================================

CREATE OR REPLACE FUNCTION upsert_job_ad_extraction(
  p_actor_id UUID,
  p_client_id UUID,
  p_payload JSONB
)
RETURNS SETOF job_ads
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_existing job_ads%ROWTYPE;
  v_saved job_ads%ROWTYPE;
  v_status TEXT := 'needs_review';
  v_keep_review BOOLEAN := false;
  v_canonical_url TEXT := p_payload->>'canonical_url';
  v_content_hash TEXT := p_payload->>'raw_content_hash';
  v_extraction_hash TEXT := p_payload->>'extraction_hash';
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_payload IS NULL
     OR jsonb_typeof(p_payload) <> 'object'
     OR NULLIF(v_canonical_url, '') IS NULL
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

  -- Serializes first insert as well as updates for this tenant + canonical URL.
  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_client_id::TEXT || ':' || v_canonical_url, 0)
  );

  SELECT *
    INTO v_existing
  FROM job_ads
  WHERE client_id = p_client_id
    AND canonical_url = v_canonical_url
  FOR UPDATE;

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
      source_host = p_payload->>'source_host',
      source_job_id = NULLIF(p_payload->>'source_job_id', ''),
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
      p_payload->>'source_host',
      NULLIF(p_payload->>'source_job_id', ''),
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

  RETURN NEXT v_saved;
END;
$$;

REVOKE ALL ON FUNCTION upsert_job_ad_extraction(UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION upsert_job_ad_extraction(UUID, UUID, JSONB)
  TO service_role;

CREATE OR REPLACE FUNCTION upsert_job_discoveries(
  p_client_id UUID,
  p_run_id UUID,
  p_items JSONB
)
RETURNS TABLE(result_count INTEGER, new_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_items IS NULL
     OR jsonb_typeof(p_items) <> 'array'
     OR jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'invalid discovery payload' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM job_discovery_runs
    WHERE id = p_run_id
      AND client_id = p_client_id
      AND status = 'running'
  ) THEN
    RAISE EXCEPTION 'discovery run not found' USING ERRCODE = 'P0002';
  END IF;

  WITH incoming AS (
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
      expires_at TIMESTAMPTZ
    )
    WHERE NULLIF(item.canonical_url, '') IS NOT NULL
      AND NULLIF(item.job_url, '') IS NOT NULL
      AND NULLIF(item.title, '') IS NOT NULL
    ORDER BY item.canonical_url
  ),
  inserted AS (
    INSERT INTO job_discoveries (
      client_id, discovery_run_id, source, source_job_id, job_url,
      canonical_url, title, company_name, company_website, location,
      country, salary_text, work_type, work_arrangement, summary,
      listed_at, expires_at, status
    )
    SELECT
      p_client_id, p_run_id, source, source_job_id, job_url,
      canonical_url, title, company_name, company_website, location,
      country, salary_text, work_type, work_arrangement, summary,
      listed_at, expires_at, 'new'
    FROM incoming
    ON CONFLICT (client_id, canonical_url) DO NOTHING
    RETURNING 1
  )
  SELECT
    (SELECT count(*)::INTEGER FROM incoming),
    (SELECT count(*)::INTEGER FROM inserted)
  INTO result_count, new_count;

  -- Deliberately excludes status and job_ad_id so concurrent user decisions
  -- can never be reverted by a discovery refresh.
  WITH incoming AS (
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
      expires_at TIMESTAMPTZ
    )
    WHERE NULLIF(item.canonical_url, '') IS NOT NULL
    ORDER BY item.canonical_url
  )
  UPDATE job_discoveries AS existing
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
    last_seen_at = now(),
    updated_at = now()
  FROM incoming
  WHERE existing.client_id = p_client_id
    AND existing.canonical_url = incoming.canonical_url;

  RETURN NEXT;
END;
$$;

REVOKE ALL ON FUNCTION upsert_job_discoveries(UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION upsert_job_discoveries(UUID, UUID, JSONB)
  TO service_role;

SELECT json_build_object(
  'migration_complete',
    to_regprocedure('public.upsert_job_ad_extraction(uuid,uuid,jsonb)') IS NOT NULL
    AND to_regprocedure('public.upsert_job_discoveries(uuid,uuid,jsonb)') IS NOT NULL,
  'installed_functions', ARRAY[
    'upsert_job_ad_extraction',
    'upsert_job_discoveries'
  ]
) AS rapidtal_migration_021_result;
