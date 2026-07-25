-- ============================================================
-- 022_company_enrichment.sql
-- Phase 3: evidence-backed employer enrichment.
-- Run after 021_job_pipeline_atomicity.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS lead_companies (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  domain                TEXT NOT NULL,
  website_url           TEXT NOT NULL,
  name                  TEXT,
  industry              TEXT,
  location              TEXT,
  services              TEXT[] NOT NULL DEFAULT '{}',
  description           TEXT,
  source_backed_data    JSONB NOT NULL DEFAULT '{}'::JSONB,
  inferred_data         JSONB NOT NULL DEFAULT '{}'::JSONB,
  evidence              JSONB NOT NULL DEFAULT '{}'::JSONB,
  enrichment_hash       TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'needs_review'
                          CHECK (status IN ('needs_review', 'approved', 'rejected', 'error')),
  reviewed_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at           TIMESTAMPTZ,
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_enriched_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lead_companies_client_domain_key UNIQUE (client_id, domain),
  CONSTRAINT lead_companies_domain_normalized CHECK (
    domain = lower(domain)
    AND domain ~ '^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$'
  ),
  CONSTRAINT lead_companies_website_https CHECK (website_url ~ '^https://')
);

CREATE TABLE IF NOT EXISTS company_enrichment_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_id        UUID REFERENCES lead_companies(id) ON DELETE SET NULL,
  job_ad_id         UUID NOT NULL REFERENCES job_ads(id) ON DELETE CASCADE,
  domain            TEXT,
  status            TEXT NOT NULL DEFAULT 'running'
                      CHECK (status IN ('running', 'completed', 'failed', 'reused')),
  provider          TEXT NOT NULL DEFAULT 'apify',
  provider_run_id   TEXT,
  page_count        INTEGER NOT NULL DEFAULT 0 CHECK (page_count >= 0),
  cost_usd          NUMERIC(12,6) NOT NULL DEFAULT 0 CHECK (cost_usd >= 0),
  tokens_used       INTEGER NOT NULL DEFAULT 0 CHECK (tokens_used >= 0),
  duration_ms       INTEGER,
  error_code        TEXT,
  error_message     TEXT,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at      TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lead_company_facts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_id        UUID NOT NULL REFERENCES lead_companies(id) ON DELETE CASCADE,
  enrichment_run_id UUID NOT NULL REFERENCES company_enrichment_runs(id) ON DELETE CASCADE,
  field_name        TEXT NOT NULL CHECK (
                      field_name IN ('name', 'industry', 'location', 'services', 'description')
                    ),
  value             JSONB NOT NULL,
  fact_type         TEXT NOT NULL CHECK (fact_type IN ('source_backed', 'inferred')),
  source_url        TEXT,
  source_excerpt    TEXT,
  rationale         TEXT,
  confidence        NUMERIC(4,3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lead_company_facts_source_contract CHECK (
    (
      fact_type = 'source_backed'
      AND source_url IS NOT NULL
      AND source_url ~ '^https://'
      AND source_excerpt IS NOT NULL
    )
    OR (
      fact_type = 'inferred'
      AND rationale IS NOT NULL
    )
  )
);

CREATE TABLE IF NOT EXISTS lead_company_review_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_id        UUID NOT NULL REFERENCES lead_companies(id) ON DELETE CASCADE,
  from_status       TEXT NOT NULL,
  to_status         TEXT NOT NULL CHECK (
                      to_status IN ('needs_review', 'approved', 'rejected')
                    ),
  enrichment_hash   TEXT NOT NULL,
  reviewed_by       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE job_ads
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES lead_companies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS lead_companies_client_status_updated_idx
  ON lead_companies (client_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS company_enrichment_runs_client_started_idx
  ON company_enrichment_runs (client_id, started_at DESC);
CREATE INDEX IF NOT EXISTS company_enrichment_runs_job_ad_idx
  ON company_enrichment_runs (job_ad_id, started_at DESC);
CREATE INDEX IF NOT EXISTS lead_company_facts_company_created_idx
  ON lead_company_facts (company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS lead_company_review_events_company_created_idx
  ON lead_company_review_events (company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS job_ads_company_idx
  ON job_ads (company_id) WHERE company_id IS NOT NULL;

ALTER TABLE lead_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_enrichment_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_company_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_company_review_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_companies_super_admin_select"
  ON lead_companies FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "lead_companies_own_client_select"
  ON lead_companies FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

CREATE POLICY "company_enrichment_runs_super_admin_select"
  ON company_enrichment_runs FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "company_enrichment_runs_own_client_select"
  ON company_enrichment_runs FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

CREATE POLICY "lead_company_facts_super_admin_select"
  ON lead_company_facts FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "lead_company_facts_own_client_select"
  ON lead_company_facts FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

CREATE POLICY "lead_company_review_events_super_admin_select"
  ON lead_company_review_events FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "lead_company_review_events_own_client_select"
  ON lead_company_review_events FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

GRANT SELECT ON
  lead_companies, company_enrichment_runs, lead_company_facts,
  lead_company_review_events
  TO authenticated;
REVOKE INSERT, UPDATE, DELETE
  ON lead_companies, company_enrichment_runs, lead_company_facts,
  lead_company_review_events
  FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON lead_companies, company_enrichment_runs, lead_company_facts,
  lead_company_review_events
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
     OR jsonb_typeof(COALESCE(p_payload->'facts', '[]'::JSONB)) <> 'array'
     OR jsonb_array_length(COALESCE(p_payload->'facts', '[]'::JSONB)) > 50 THEN
    RAISE EXCEPTION 'invalid company enrichment payload' USING ERRCODE = '22023';
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
  IF NOT EXISTS (
    SELECT 1
    FROM job_ads
    WHERE id = p_job_ad_id
      AND client_id = p_client_id
      AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'approved job advertisement not found' USING ERRCODE = 'P0002';
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM company_enrichment_runs
    WHERE id = p_run_id
      AND client_id = p_client_id
      AND job_ad_id = p_job_ad_id
      AND status = 'running'
  ) THEN
    RAISE EXCEPTION 'company enrichment run not found' USING ERRCODE = 'P0002';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_client_id::TEXT || ':' || v_domain, 0)
  );

  SELECT *
    INTO v_existing
  FROM lead_companies
  WHERE client_id = p_client_id
    AND domain = v_domain
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
      p_client_id,
      v_domain,
      p_payload->>'website_url',
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
    p_client_id,
    v_saved.id,
    p_run_id,
    fact.field_name,
    fact.value,
    fact.fact_type,
    NULLIF(fact.source_url, ''),
    NULLIF(fact.source_excerpt, ''),
    NULLIF(fact.rationale, ''),
    fact.confidence
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
    page_count = COALESCE((p_payload->>'page_count')::INTEGER, 0),
    cost_usd = COALESCE((p_payload->>'cost_usd')::NUMERIC, 0),
    tokens_used = COALESCE((p_payload->>'tokens_used')::INTEGER, 0),
    duration_ms = NULLIF(p_payload->>'duration_ms', '')::INTEGER,
    completed_at = now()
  WHERE id = p_run_id AND client_id = p_client_id;

  RETURN NEXT v_saved;
END;
$$;

REVOKE ALL ON FUNCTION upsert_lead_company_enrichment(UUID, UUID, UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION upsert_lead_company_enrichment(UUID, UUID, UUID, UUID, JSONB)
  TO service_role;

CREATE OR REPLACE FUNCTION reuse_lead_company(
  p_actor_id UUID,
  p_client_id UUID,
  p_job_ad_id UUID,
  p_run_id UUID,
  p_company_id UUID
)
RETURNS SETOF lead_companies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
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
    WHERE id = p_job_ad_id AND client_id = p_client_id AND status = 'approved'
  ) OR NOT EXISTS (
    SELECT 1 FROM lead_companies
    WHERE id = p_company_id AND client_id = p_client_id
  ) OR NOT EXISTS (
    SELECT 1 FROM company_enrichment_runs
    WHERE id = p_run_id
      AND client_id = p_client_id
      AND job_ad_id = p_job_ad_id
      AND status = 'running'
  ) THEN
    RAISE EXCEPTION 'approved job, company, or enrichment run not found'
      USING ERRCODE = 'P0002';
  END IF;

  UPDATE job_ads
  SET company_id = p_company_id, updated_at = now()
  WHERE id = p_job_ad_id AND client_id = p_client_id;

  UPDATE company_enrichment_runs
  SET company_id = p_company_id, status = 'reused', completed_at = now()
  WHERE id = p_run_id
    AND client_id = p_client_id
    AND job_ad_id = p_job_ad_id
    AND status = 'running';

  RETURN QUERY
  SELECT company.* FROM lead_companies AS company
  WHERE company.id = p_company_id AND company.client_id = p_client_id;
END;
$$;

REVOKE ALL ON FUNCTION reuse_lead_company(UUID, UUID, UUID, UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION reuse_lead_company(UUID, UUID, UUID, UUID, UUID)
  TO service_role;

CREATE OR REPLACE FUNCTION review_lead_company(
  p_actor_id UUID,
  p_client_id UUID,
  p_company_id UUID,
  p_status TEXT
)
RETURNS SETOF lead_companies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_from_status TEXT;
  v_enrichment_hash TEXT;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_status NOT IN ('needs_review', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'invalid company review status' USING ERRCODE = '22023';
  END IF;
  SELECT role, client_id INTO v_actor_role, v_actor_client_id
  FROM users WHERE id = p_actor_id;
  IF v_actor_role IS NULL
     OR v_actor_role NOT IN ('super_admin', 'client_admin')
     OR (v_actor_role <> 'super_admin' AND v_actor_client_id IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT status, enrichment_hash
    INTO v_from_status, v_enrichment_hash
  FROM lead_companies
  WHERE id = p_company_id AND client_id = p_client_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'company not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE lead_companies
  SET
    status = p_status,
    reviewed_by = CASE WHEN p_status = 'needs_review' THEN NULL ELSE p_actor_id END,
    reviewed_at = CASE WHEN p_status = 'needs_review' THEN NULL ELSE now() END,
    updated_at = now()
  WHERE id = p_company_id AND client_id = p_client_id;

  INSERT INTO lead_company_review_events (
    client_id, company_id, from_status, to_status,
    enrichment_hash, reviewed_by
  )
  VALUES (
    p_client_id, p_company_id, v_from_status, p_status,
    v_enrichment_hash, p_actor_id
  );

  RETURN QUERY
  SELECT company.* FROM lead_companies AS company
  WHERE company.id = p_company_id AND company.client_id = p_client_id;
END;
$$;

REVOKE ALL ON FUNCTION review_lead_company(UUID, UUID, UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION review_lead_company(UUID, UUID, UUID, TEXT)
  TO service_role;

COMMENT ON TABLE lead_companies IS
  'Tenant-scoped employer companies derived from approved public job advertisements. Never represents a human contact.';
COMMENT ON COLUMN lead_companies.source_backed_data IS
  'Latest values backed by public company-page evidence.';
COMMENT ON COLUMN lead_companies.inferred_data IS
  'Clearly separated machine inferences; never treated as sourced fact.';

SELECT json_build_object(
  'migration_complete',
    to_regclass('public.lead_companies') IS NOT NULL
    AND to_regclass('public.company_enrichment_runs') IS NOT NULL
    AND to_regclass('public.lead_company_facts') IS NOT NULL
    AND to_regclass('public.lead_company_review_events') IS NOT NULL
    AND to_regprocedure(
      'public.upsert_lead_company_enrichment(uuid,uuid,uuid,uuid,jsonb)'
    ) IS NOT NULL
    AND to_regprocedure(
      'public.reuse_lead_company(uuid,uuid,uuid,uuid,uuid)'
    ) IS NOT NULL
    AND to_regprocedure(
      'public.review_lead_company(uuid,uuid,uuid,text)'
    ) IS NOT NULL,
  'installed_tables', ARRAY[
    'lead_companies',
    'company_enrichment_runs',
    'lead_company_facts',
    'lead_company_review_events'
  ],
  'installed_functions', ARRAY[
    'upsert_lead_company_enrichment',
    'reuse_lead_company',
    'review_lead_company'
  ]
) AS rapidtal_phase_3_result;
