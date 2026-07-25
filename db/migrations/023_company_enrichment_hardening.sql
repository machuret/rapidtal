-- ============================================================
-- 023_company_enrichment_hardening.sql
-- Phase 3 hardening: atomic runs, provenance, immutable evidence.
-- Run after 022_company_enrichment.sql.
-- ============================================================

ALTER TABLE company_enrichment_runs
  ADD COLUMN IF NOT EXISTS resolution_method TEXT
    CHECK (resolution_method IS NULL OR resolution_method IN ('job_ad', 'web_search')),
  ADD COLUMN IF NOT EXISTS resolution_confidence NUMERIC(4,3)
    CHECK (resolution_confidence IS NULL OR resolution_confidence BETWEEN 0 AND 1),
  ADD COLUMN IF NOT EXISTS resolution_evidence JSONB NOT NULL DEFAULT '{}'::JSONB,
  ADD COLUMN IF NOT EXISTS search_provider_run_id TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS prompt_version TEXT,
  ADD COLUMN IF NOT EXISTS input_hash TEXT,
  ADD COLUMN IF NOT EXISTS ai_estimated_cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0
    CHECK (ai_estimated_cost_usd >= 0);

UPDATE company_enrichment_runs
SET
  status = 'failed',
  error_code = 'stale_run_recovered',
  error_message = 'A stale enrichment run was closed by migration 023.',
  completed_at = now()
WHERE status = 'running'
  AND started_at < now() - interval '10 minutes';

WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY client_id, job_ad_id
      ORDER BY started_at DESC, id DESC
    ) AS run_rank
  FROM company_enrichment_runs
  WHERE status = 'running'
)
UPDATE company_enrichment_runs AS run
SET
  status = 'failed',
  error_code = 'duplicate_run_recovered',
  error_message = 'A duplicate enrichment run was closed by migration 023.',
  completed_at = now()
FROM ranked
WHERE run.id = ranked.id
  AND ranked.run_rank > 1;

CREATE UNIQUE INDEX IF NOT EXISTS company_enrichment_runs_one_running_job_idx
  ON company_enrichment_runs (client_id, job_ad_id)
  WHERE status = 'running';

REVOKE INSERT, UPDATE, DELETE ON lead_company_facts, lead_company_review_events
  FROM service_role;
GRANT SELECT ON lead_company_facts, lead_company_review_events TO service_role;
REVOKE INSERT, UPDATE, DELETE ON lead_companies FROM service_role;
GRANT SELECT ON lead_companies TO service_role;
REVOKE DELETE ON company_enrichment_runs FROM service_role;

CREATE OR REPLACE FUNCTION begin_company_enrichment_run(
  p_actor_id UUID,
  p_client_id UUID,
  p_job_ad_id UUID,
  p_input_hash TEXT,
  p_model TEXT,
  p_prompt_version TEXT
)
RETURNS SETOF company_enrichment_runs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_run company_enrichment_runs%ROWTYPE;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF NULLIF(p_input_hash, '') IS NULL
     OR NULLIF(p_model, '') IS NULL
     OR NULLIF(p_prompt_version, '') IS NULL THEN
    RAISE EXCEPTION 'run provenance is required' USING ERRCODE = '22023';
  END IF;

  SELECT role, client_id INTO v_actor_role, v_actor_client_id
  FROM users WHERE id = p_actor_id;
  IF v_actor_role IS NULL
     OR v_actor_role NOT IN ('super_admin', 'client_admin')
     OR (v_actor_role <> 'super_admin' AND v_actor_client_id IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM job_ads
    WHERE id = p_job_ad_id
      AND client_id = p_client_id
      AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'approved job advertisement not found' USING ERRCODE = 'P0002';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_client_id::TEXT || ':' || p_job_ad_id::TEXT, 0)
  );

  UPDATE company_enrichment_runs
  SET
    status = 'failed',
    error_code = 'stale_run_recovered',
    error_message = 'The previous enrichment attempt exceeded ten minutes.',
    completed_at = now()
  WHERE client_id = p_client_id
    AND job_ad_id = p_job_ad_id
    AND status = 'running'
    AND started_at < now() - interval '10 minutes';

  IF EXISTS (
    SELECT 1 FROM company_enrichment_runs
    WHERE client_id = p_client_id
      AND job_ad_id = p_job_ad_id
      AND status = 'running'
  ) THEN
    RAISE EXCEPTION 'company enrichment already running' USING ERRCODE = '55P03';
  END IF;

  INSERT INTO company_enrichment_runs (
    client_id, job_ad_id, status, provider, created_by,
    input_hash, model, prompt_version
  )
  VALUES (
    p_client_id, p_job_ad_id, 'running', 'apify', p_actor_id,
    p_input_hash, p_model, p_prompt_version
  )
  RETURNING * INTO v_run;

  RETURN NEXT v_run;
END;
$$;

REVOKE ALL ON FUNCTION begin_company_enrichment_run(UUID, UUID, UUID, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION begin_company_enrichment_run(UUID, UUID, UUID, TEXT, TEXT, TEXT)
  TO service_role;

CREATE OR REPLACE FUNCTION upsert_lead_company_enrichment(
  p_actor_id UUID,
  p_client_id UUID,
  p_job_ad_id UUID,
  p_run_id UUID,
  p_payload JSONB
)
RETURNS SETOF lead_companies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_domain TEXT := lower(p_payload->>'domain');
  v_existing lead_companies%ROWTYPE;
  v_saved lead_companies%ROWTYPE;
  v_run company_enrichment_runs%ROWTYPE;
  v_status TEXT := 'needs_review';
  v_keep_review BOOLEAN := false;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_payload IS NULL
     OR jsonb_typeof(p_payload) <> 'object'
     OR NULLIF(v_domain, '') IS NULL
     OR NULLIF(p_payload->>'website_url', '') IS NULL
     OR NULLIF(p_payload->>'enrichment_hash', '') IS NULL
     OR NULLIF(p_payload->>'input_hash', '') IS NULL
     OR NULLIF(p_payload->>'model', '') IS NULL
     OR NULLIF(p_payload->>'prompt_version', '') IS NULL
     OR NULLIF(p_payload->>'resolution_method', '') IS NULL
     OR (p_payload->>'resolution_method') NOT IN ('job_ad', 'web_search')
     OR jsonb_typeof(COALESCE(p_payload->'facts', '[]'::JSONB)) <> 'array'
     OR jsonb_array_length(COALESCE(p_payload->'facts', '[]'::JSONB)) > 50 THEN
    RAISE EXCEPTION 'invalid company enrichment payload' USING ERRCODE = '22023';
  END IF;

  SELECT role, client_id INTO v_actor_role, v_actor_client_id
  FROM users WHERE id = p_actor_id;
  IF v_actor_role IS NULL
     OR v_actor_role NOT IN ('super_admin', 'client_admin')
     OR (v_actor_role <> 'super_admin' AND v_actor_client_id IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM job_ads
    WHERE id = p_job_ad_id
      AND client_id = p_client_id
      AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'approved job advertisement not found' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_run
  FROM company_enrichment_runs
  WHERE id = p_run_id
    AND client_id = p_client_id
    AND job_ad_id = p_job_ad_id
  FOR UPDATE;
  IF NOT FOUND OR v_run.status <> 'running' THEN
    RAISE EXCEPTION 'company enrichment run not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_run.input_hash IS DISTINCT FROM p_payload->>'input_hash'
     OR v_run.model IS DISTINCT FROM p_payload->>'model'
     OR v_run.prompt_version IS DISTINCT FROM p_payload->>'prompt_version' THEN
    RAISE EXCEPTION 'run provenance does not match' USING ERRCODE = '22023';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_client_id::TEXT || ':' || v_domain, 0)
  );
  SELECT * INTO v_existing
  FROM lead_companies
  WHERE client_id = p_client_id AND domain = v_domain
  FOR UPDATE;

  IF FOUND THEN
    IF v_existing.status IN ('approved', 'rejected')
       AND v_existing.enrichment_hash = p_payload->>'enrichment_hash' THEN
      v_status := v_existing.status;
      v_keep_review := true;
    END IF;
    UPDATE lead_companies
    SET
      website_url = p_payload->>'website_url',
      name = NULLIF(p_payload->>'name', ''),
      industry = NULLIF(p_payload->>'industry', ''),
      location = NULLIF(p_payload->>'location', ''),
      services = ARRAY(
        SELECT jsonb_array_elements_text(COALESCE(p_payload->'services', '[]'::JSONB))
      ),
      description = NULLIF(p_payload->>'description', ''),
      source_backed_data = COALESCE(p_payload->'source_backed_data', '{}'::JSONB),
      inferred_data = COALESCE(p_payload->'inferred_data', '{}'::JSONB),
      evidence = COALESCE(p_payload->'evidence', '{}'::JSONB),
      enrichment_hash = p_payload->>'enrichment_hash',
      status = v_status,
      reviewed_by = CASE WHEN v_keep_review THEN v_existing.reviewed_by ELSE NULL END,
      reviewed_at = CASE WHEN v_keep_review THEN v_existing.reviewed_at ELSE NULL END,
      updated_at = now(),
      last_enriched_at = now()
    WHERE id = v_existing.id
    RETURNING * INTO v_saved;
  ELSE
    INSERT INTO lead_companies (
      client_id, domain, website_url, name, industry, location, services,
      description, source_backed_data, inferred_data, evidence,
      enrichment_hash, status, created_by
    )
    VALUES (
      p_client_id, v_domain, p_payload->>'website_url',
      NULLIF(p_payload->>'name', ''),
      NULLIF(p_payload->>'industry', ''),
      NULLIF(p_payload->>'location', ''),
      ARRAY(
        SELECT jsonb_array_elements_text(COALESCE(p_payload->'services', '[]'::JSONB))
      ),
      NULLIF(p_payload->>'description', ''),
      COALESCE(p_payload->'source_backed_data', '{}'::JSONB),
      COALESCE(p_payload->'inferred_data', '{}'::JSONB),
      COALESCE(p_payload->'evidence', '{}'::JSONB),
      p_payload->>'enrichment_hash',
      'needs_review',
      p_actor_id
    )
    RETURNING * INTO v_saved;
  END IF;

  INSERT INTO lead_company_facts (
    client_id, company_id, enrichment_run_id, field_name, value, fact_type,
    source_url, source_excerpt, rationale, confidence
  )
  SELECT
    p_client_id, v_saved.id, p_run_id, fact.field_name, fact.value,
    fact.fact_type, NULLIF(fact.source_url, ''), NULLIF(fact.source_excerpt, ''),
    NULLIF(fact.rationale, ''), fact.confidence
  FROM jsonb_to_recordset(COALESCE(p_payload->'facts', '[]'::JSONB)) AS fact(
    field_name TEXT,
    value JSONB,
    fact_type TEXT,
    source_url TEXT,
    source_excerpt TEXT,
    rationale TEXT,
    confidence NUMERIC
  );

  UPDATE job_ads
  SET company_id = v_saved.id, updated_at = now()
  WHERE id = p_job_ad_id AND client_id = p_client_id;

  UPDATE company_enrichment_runs
  SET
    company_id = v_saved.id,
    domain = v_domain,
    status = 'completed',
    provider_run_id = NULLIF(p_payload->>'provider_run_id', ''),
    search_provider_run_id = NULLIF(p_payload->>'search_provider_run_id', ''),
    page_count = COALESCE((p_payload->>'page_count')::INTEGER, 0),
    cost_usd = COALESCE((p_payload->>'cost_usd')::NUMERIC, 0),
    tokens_used = COALESCE((p_payload->>'tokens_used')::INTEGER, 0),
    ai_estimated_cost_usd =
      COALESCE((p_payload->>'ai_estimated_cost_usd')::NUMERIC, 0),
    duration_ms = NULLIF(p_payload->>'duration_ms', '')::INTEGER,
    resolution_method = p_payload->>'resolution_method',
    resolution_confidence = COALESCE((p_payload->>'resolution_confidence')::NUMERIC, 0),
    resolution_evidence = COALESCE(p_payload->'resolution_evidence', '{}'::JSONB),
    completed_at = now()
  WHERE id = p_run_id
    AND client_id = p_client_id
    AND status = 'running';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'company enrichment run was concurrently completed'
      USING ERRCODE = '40001';
  END IF;
  RETURN NEXT v_saved;
END;
$$;

REVOKE ALL ON FUNCTION upsert_lead_company_enrichment(UUID, UUID, UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION upsert_lead_company_enrichment(UUID, UUID, UUID, UUID, JSONB)
  TO service_role;

COMMENT ON COLUMN company_enrichment_runs.resolution_evidence IS
  'Auditable domain-resolution query, candidates, and selected result. No human contact data.';
COMMENT ON COLUMN company_enrichment_runs.input_hash IS
  'SHA-256 of the approved input and extraction configuration.';

SELECT json_build_object(
  'migration_complete',
    to_regprocedure(
      'public.begin_company_enrichment_run(uuid,uuid,uuid,text,text,text)'
    ) IS NOT NULL
    AND to_regprocedure(
      'public.upsert_lead_company_enrichment(uuid,uuid,uuid,uuid,jsonb)'
    ) IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE schemaname = 'public'
        AND indexname = 'company_enrichment_runs_one_running_job_idx'
    ),
  'installed_functions', ARRAY[
    'begin_company_enrichment_run',
    'upsert_lead_company_enrichment'
  ],
  'hardening', ARRAY[
    'atomic_running_job_guard',
    'stale_run_recovery',
    'verified_provenance',
    'immutable_facts_and_review_events'
  ]
) AS rapidtal_phase_3_hardening_result;
