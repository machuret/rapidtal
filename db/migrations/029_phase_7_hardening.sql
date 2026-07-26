-- ============================================================
-- 029_phase_7_hardening.sql
-- Phase 7 hardening: verified accuracy provenance and expired
-- advertisement lifecycle enforcement.
-- Run after 028_testing_and_observability.sql.
-- ============================================================

CREATE OR REPLACE FUNCTION enforce_job_ad_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.expires_at IS NOT NULL AND NEW.expires_at <= now() THEN
    NEW.status := 'expired';
    NEW.reviewed_by := NULL;
    NEW.reviewed_at := NULL;
    NEW.reviewed_content_hash := NULL;
    NEW.reviewed_extraction_hash := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS job_ads_enforce_expiry ON job_ads;
CREATE TRIGGER job_ads_enforce_expiry
  BEFORE INSERT OR UPDATE OF expires_at, status ON job_ads
  FOR EACH ROW EXECUTE FUNCTION enforce_job_ad_expiry();

UPDATE job_ads
SET status = 'expired', updated_at = now()
WHERE expires_at IS NOT NULL
  AND expires_at <= now()
  AND status <> 'expired';

CREATE OR REPLACE FUNCTION review_job_ad(
  p_actor_id UUID,
  p_client_id UUID,
  p_job_ad_id UUID,
  p_status TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS SETOF job_ads
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_from_status TEXT;
  v_content_hash TEXT;
  v_extraction_hash TEXT;
  v_expires_at TIMESTAMPTZ;
  v_notes TEXT;
BEGIN
  IF p_status NOT IN ('needs_review', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid review status' USING ERRCODE = '22023';
  END IF;

  SELECT role, client_id INTO v_actor_role, v_actor_client_id
  FROM users WHERE id = p_actor_id;
  IF v_actor_role IS NULL
     OR v_actor_role NOT IN ('super_admin', 'client_admin')
     OR (v_actor_role <> 'super_admin' AND v_actor_client_id IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT status, raw_content_hash, extraction_hash, expires_at
    INTO v_from_status, v_content_hash, v_extraction_hash, v_expires_at
  FROM job_ads
  WHERE id = p_job_ad_id AND client_id = p_client_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job advertisement not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_expires_at IS NOT NULL AND v_expires_at <= now() THEN
    RAISE EXCEPTION 'Expired job advertisements cannot be reviewed'
      USING ERRCODE = '22023';
  END IF;

  v_notes := NULLIF(left(btrim(COALESCE(p_notes, '')), 1000), '');
  UPDATE job_ads
  SET
    status = p_status,
    reviewed_by = CASE WHEN p_status = 'needs_review' THEN NULL ELSE p_actor_id END,
    reviewed_at = CASE WHEN p_status = 'needs_review' THEN NULL ELSE now() END,
    reviewed_content_hash = CASE WHEN p_status = 'needs_review' THEN NULL ELSE v_content_hash END,
    reviewed_extraction_hash = CASE WHEN p_status = 'needs_review' THEN NULL ELSE v_extraction_hash END,
    updated_at = now()
  WHERE id = p_job_ad_id AND client_id = p_client_id;

  INSERT INTO job_ad_review_events (
    client_id, job_ad_id, from_status, to_status, notes, content_hash,
    extraction_hash, reviewed_by
  ) VALUES (
    p_client_id, p_job_ad_id, v_from_status, p_status, v_notes, v_content_hash,
    v_extraction_hash, p_actor_id
  );

  RETURN QUERY
  SELECT job.* FROM job_ads AS job
  WHERE job.id = p_job_ad_id AND job.client_id = p_client_id;
END;
$$;

REVOKE ALL ON FUNCTION review_job_ad(UUID, UUID, UUID, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION review_job_ad(UUID, UUID, UUID, TEXT, TEXT)
  TO service_role;

CREATE OR REPLACE FUNCTION save_job_extraction_quality_measurement(
  p_actor_id UUID,
  p_client_id UUID,
  p_payload JSONB
)
RETURNS SETOF job_extraction_quality_measurements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role TEXT;
  v_actor_client UUID;
  v_job_ad_id UUID;
  v_scrape_run_id UUID;
  v_expected JSONB;
  v_actual JSONB;
  v_measured INTEGER;
  v_matched INTEGER;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  SELECT role, client_id INTO v_role, v_actor_client FROM users WHERE id = p_actor_id;
  IF v_role IS NULL OR v_role NOT IN ('super_admin', 'client_admin')
     OR (v_role <> 'super_admin' AND v_actor_client IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;
  IF p_payload IS NULL OR jsonb_typeof(p_payload) <> 'object' THEN
    RAISE EXCEPTION 'invalid quality measurement' USING ERRCODE = '22023';
  END IF;

  v_job_ad_id := NULLIF(p_payload->>'job_ad_id', '')::UUID;
  v_scrape_run_id := NULLIF(p_payload->>'scrape_run_id', '')::UUID;
  v_expected := p_payload->'expected_fields';
  v_actual := p_payload->'actual_fields';
  IF jsonb_typeof(v_expected) <> 'object'
     OR jsonb_typeof(v_actual) <> 'object' THEN
    RAISE EXCEPTION 'invalid quality measurement fields' USING ERRCODE = '22023';
  END IF;
  SELECT count(*) INTO v_measured FROM jsonb_object_keys(v_expected);
  IF v_measured NOT BETWEEN 1 AND 50 THEN
    RAISE EXCEPTION 'invalid quality measurement field count' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM jsonb_object_keys(v_expected) AS field_name
    WHERE field_name NOT IN (
      'source_job_id', 'title', 'company_name', 'company_website', 'location',
      'remote_type', 'employment_type', 'salary_min', 'salary_max',
      'salary_currency', 'salary_period', 'description', 'responsibilities',
      'skills', 'posted_at', 'expires_at', 'apply_url'
    )
  ) THEN
    RAISE EXCEPTION 'unsupported quality measurement field' USING ERRCODE = '22023';
  END IF;
  IF v_job_ad_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM job_ads WHERE id = v_job_ad_id AND client_id = p_client_id
  ) THEN
    RAISE EXCEPTION 'job advertisement not found for tenant' USING ERRCODE = 'P0002';
  END IF;
  IF v_scrape_run_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM job_scrape_runs
    WHERE id = v_scrape_run_id AND client_id = p_client_id
  ) THEN
    RAISE EXCEPTION 'scrape run not found for tenant' USING ERRCODE = 'P0002';
  END IF;
  IF v_job_ad_id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'source_job_id', source_job_id,
      'title', title,
      'company_name', company_name,
      'company_website', company_website,
      'location', location,
      'remote_type', remote_type,
      'employment_type', employment_type,
      'salary_min', salary_min,
      'salary_max', salary_max,
      'salary_currency', salary_currency,
      'salary_period', salary_period,
      'description', description,
      'responsibilities', to_jsonb(responsibilities),
      'skills', to_jsonb(skills),
      'posted_at', posted_at,
      'expires_at', expires_at,
      'apply_url', apply_url
    ) INTO v_actual
    FROM job_ads
    WHERE id = v_job_ad_id AND client_id = p_client_id;
  END IF;

  SELECT count(*) INTO v_matched
  FROM jsonb_each(v_expected) AS expected(field_name, expected_value)
  WHERE v_actual ? expected.field_name
    AND v_actual->expected.field_name = expected.expected_value;

  RETURN QUERY
  INSERT INTO job_extraction_quality_measurements (
    client_id, job_ad_id, scrape_run_id, fixture_key, fixture_kind,
    expected_fields, actual_fields, matched_fields, measured_fields,
    field_accuracy, measured_by
  ) VALUES (
    p_client_id,
    v_job_ad_id,
    v_scrape_run_id,
    p_payload->>'fixture_key',
    p_payload->>'fixture_kind',
    v_expected,
    v_actual,
    v_matched,
    v_measured,
    v_matched::NUMERIC / v_measured,
    p_actor_id
  )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION save_job_extraction_quality_measurement(UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION save_job_extraction_quality_measurement(UUID, UUID, JSONB)
  TO service_role;

SELECT jsonb_build_object(
  'migration_complete', true,
  'installed_functions', ARRAY[
    'enforce_job_ad_expiry',
    'review_job_ad',
    'save_job_extraction_quality_measurement'
  ],
  'hardening', ARRAY[
    'expired_lifecycle_enforcement',
    'database_computed_accuracy',
    'tenant_verified_quality_provenance'
  ]
) AS rapidtal_phase_7_hardening_result;
