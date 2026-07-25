-- ============================================================
-- 024_transparent_lead_scoring.sql
-- Phase 4: deterministic, versioned, explainable lead scoring.
-- Run after 023_company_enrichment_hardening.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS lead_scoring_profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
  target_roles          TEXT[] NOT NULL DEFAULT '{}',
  target_geographies    TEXT[] NOT NULL DEFAULT '{}',
  preferred_industries  TEXT[] NOT NULL DEFAULT '{}',
  company_fit_keywords  TEXT[] NOT NULL DEFAULT '{}',
  version               INTEGER NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lead_scoring_profiles_role_limit CHECK (cardinality(target_roles) <= 100),
  CONSTRAINT lead_scoring_profiles_geography_limit CHECK (cardinality(target_geographies) <= 50),
  CONSTRAINT lead_scoring_profiles_industry_limit CHECK (cardinality(preferred_industries) <= 50),
  CONSTRAINT lead_scoring_profiles_keyword_limit CHECK (cardinality(company_fit_keywords) <= 100)
);

INSERT INTO lead_scoring_profiles (
  client_id,
  target_roles,
  target_geographies
)
SELECT
  client.id,
  ARRAY[
    'sales development representative',
    'account executive',
    'account manager',
    'business development manager',
    'appointment setter',
    'inside sales representative',
    'sales operations specialist',
    'crm manager',
    'marketing assistant',
    'digital marketing specialist',
    'seo specialist',
    'content writer',
    'copywriter',
    'graphic designer',
    'video editor',
    'social media manager',
    'paid advertising specialist',
    'customer support specialist',
    'virtual assistant',
    'executive assistant',
    'operations manager',
    'project manager',
    'data entry specialist'
  ]::TEXT[],
  ARRAY[
    'Sydney',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Canberra',
    'Gold Coast',
    'Australia'
  ]::TEXT[]
FROM clients AS client
ON CONFLICT (client_id) DO NOTHING;

CREATE OR REPLACE FUNCTION initialize_lead_scoring_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO lead_scoring_profiles (client_id)
  VALUES (NEW.id)
  ON CONFLICT (client_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS clients_initialize_lead_scoring_profile ON clients;
CREATE TRIGGER clients_initialize_lead_scoring_profile
AFTER INSERT ON clients
FOR EACH ROW EXECUTE FUNCTION initialize_lead_scoring_profile();

REVOKE ALL ON FUNCTION initialize_lead_scoring_profile()
  FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS lead_scores (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_ad_id                UUID NOT NULL REFERENCES job_ads(id) ON DELETE CASCADE,
  company_id               UUID NOT NULL REFERENCES lead_companies(id) ON DELETE RESTRICT,
  scoring_profile_id       UUID NOT NULL REFERENCES lead_scoring_profiles(id) ON DELETE RESTRICT,
  ruleset_version          TEXT NOT NULL,
  profile_version          INTEGER NOT NULL CHECK (profile_version > 0),
  input_hash               TEXT NOT NULL,
  job_extraction_hash      TEXT NOT NULL,
  company_enrichment_hash  TEXT NOT NULL,
  total_score              INTEGER NOT NULL CHECK (total_score BETWEEN 0 AND 100),
  score_band               TEXT NOT NULL CHECK (score_band IN ('high', 'medium', 'low')),
  summary                  TEXT NOT NULL CHECK (length(summary) BETWEEN 1 AND 1000),
  created_by               UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lead_scores_reproducible_key
    UNIQUE (client_id, job_ad_id, ruleset_version, input_hash)
);

CREATE TABLE IF NOT EXISTS lead_score_components (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_score_id UUID NOT NULL REFERENCES lead_scores(id) ON DELETE CASCADE,
  component     TEXT NOT NULL CHECK (
                  component IN (
                    'target_role',
                    'target_geography',
                    'advertisement_recency',
                    'hiring_urgency',
                    'company_fit',
                    'outsourcing_suitability',
                    'data_completeness_confidence'
                  )
                ),
  points        INTEGER NOT NULL CHECK (points >= 0),
  max_points    INTEGER NOT NULL CHECK (max_points > 0),
  reason        TEXT NOT NULL CHECK (length(reason) BETWEEN 1 AND 2000),
  inputs        JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lead_score_components_score_component_key
    UNIQUE (lead_score_id, component),
  CONSTRAINT lead_score_components_points_limit CHECK (points <= max_points)
);

ALTER TABLE job_ads
  ADD COLUMN IF NOT EXISTS lead_score_id UUID
    REFERENCES lead_scores(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS lead_scores_client_created_idx
  ON lead_scores (client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS lead_scores_job_created_idx
  ON lead_scores (job_ad_id, created_at DESC);
CREATE INDEX IF NOT EXISTS lead_score_components_score_idx
  ON lead_score_components (lead_score_id, component);
CREATE INDEX IF NOT EXISTS job_ads_lead_score_idx
  ON job_ads (lead_score_id) WHERE lead_score_id IS NOT NULL;

ALTER TABLE lead_scoring_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_score_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_scoring_profiles_super_admin_select"
  ON lead_scoring_profiles FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "lead_scoring_profiles_own_client_select"
  ON lead_scoring_profiles FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );
CREATE POLICY "lead_scores_super_admin_select"
  ON lead_scores FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "lead_scores_own_client_select"
  ON lead_scores FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );
CREATE POLICY "lead_score_components_super_admin_select"
  ON lead_score_components FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "lead_score_components_own_client_select"
  ON lead_score_components FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

GRANT SELECT ON lead_scoring_profiles, lead_scores, lead_score_components
  TO authenticated, service_role;
REVOKE INSERT, UPDATE, DELETE
  ON lead_scoring_profiles, lead_scores, lead_score_components
  FROM authenticated, service_role;

CREATE OR REPLACE FUNCTION update_lead_scoring_profile(
  p_actor_id UUID,
  p_client_id UUID,
  p_target_roles TEXT[],
  p_target_geographies TEXT[],
  p_preferred_industries TEXT[],
  p_company_fit_keywords TEXT[]
)
RETURNS SETOF lead_scoring_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_saved lead_scoring_profiles%ROWTYPE;
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
  IF cardinality(COALESCE(p_target_roles, '{}'::TEXT[])) > 100
     OR cardinality(COALESCE(p_target_geographies, '{}'::TEXT[])) > 50
     OR cardinality(COALESCE(p_preferred_industries, '{}'::TEXT[])) > 50
     OR cardinality(COALESCE(p_company_fit_keywords, '{}'::TEXT[])) > 100 THEN
    RAISE EXCEPTION 'scoring profile exceeds configured limits' USING ERRCODE = '22023';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM unnest(
      COALESCE(p_target_roles, '{}'::TEXT[])
      || COALESCE(p_target_geographies, '{}'::TEXT[])
      || COALESCE(p_preferred_industries, '{}'::TEXT[])
      || COALESCE(p_company_fit_keywords, '{}'::TEXT[])
    ) AS value
    WHERE NULLIF(btrim(value), '') IS NULL OR length(value) > 100
  ) THEN
    RAISE EXCEPTION 'scoring profile contains an invalid value' USING ERRCODE = '22023';
  END IF;

  INSERT INTO lead_scoring_profiles (
    client_id, target_roles, target_geographies, preferred_industries,
    company_fit_keywords, updated_by
  )
  VALUES (
    p_client_id,
    COALESCE(p_target_roles, '{}'::TEXT[]),
    COALESCE(p_target_geographies, '{}'::TEXT[]),
    COALESCE(p_preferred_industries, '{}'::TEXT[]),
    COALESCE(p_company_fit_keywords, '{}'::TEXT[]),
    p_actor_id
  )
  ON CONFLICT (client_id) DO UPDATE
  SET
    target_roles = EXCLUDED.target_roles,
    target_geographies = EXCLUDED.target_geographies,
    preferred_industries = EXCLUDED.preferred_industries,
    company_fit_keywords = EXCLUDED.company_fit_keywords,
    version = lead_scoring_profiles.version + 1,
    updated_by = p_actor_id,
    updated_at = now()
  RETURNING * INTO v_saved;

  RETURN NEXT v_saved;
END;
$$;

REVOKE ALL ON FUNCTION update_lead_scoring_profile(
  UUID, UUID, TEXT[], TEXT[], TEXT[], TEXT[]
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION update_lead_scoring_profile(
  UUID, UUID, TEXT[], TEXT[], TEXT[], TEXT[]
) TO service_role;

CREATE OR REPLACE FUNCTION save_transparent_lead_score(
  p_actor_id UUID,
  p_client_id UUID,
  p_job_ad_id UUID,
  p_payload JSONB
)
RETURNS SETOF lead_scores
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_job job_ads%ROWTYPE;
  v_company lead_companies%ROWTYPE;
  v_profile lead_scoring_profiles%ROWTYPE;
  v_saved lead_scores%ROWTYPE;
  v_component_count INTEGER;
  v_component_distinct_count INTEGER;
  v_component_total INTEGER;
  v_components_valid BOOLEAN;
  v_inserted BOOLEAN := false;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_payload IS NULL
     OR jsonb_typeof(p_payload) <> 'object'
     OR NULLIF(p_payload->>'scoring_profile_id', '') IS NULL
     OR NULLIF(p_payload->>'profile_version', '') IS NULL
     OR p_payload->>'ruleset_version' IS DISTINCT FROM 'phase4-v1'
     OR NULLIF(p_payload->>'input_hash', '') IS NULL
     OR NULLIF(p_payload->>'job_extraction_hash', '') IS NULL
     OR NULLIF(p_payload->>'company_enrichment_hash', '') IS NULL
     OR NULLIF(p_payload->>'summary', '') IS NULL
     OR NULLIF(p_payload->>'total_score', '') IS NULL
     OR NULLIF(p_payload->>'score_band', '') IS NULL
     OR (p_payload->>'score_band') NOT IN ('high', 'medium', 'low')
     OR jsonb_typeof(COALESCE(p_payload->'components', '[]'::JSONB)) <> 'array' THEN
    RAISE EXCEPTION 'invalid transparent score payload' USING ERRCODE = '22023';
  END IF;
  IF p_payload->>'input_hash' !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'invalid transparent score input hash' USING ERRCODE = '22023';
  END IF;

  SELECT role, client_id INTO v_actor_role, v_actor_client_id
  FROM users WHERE id = p_actor_id;
  IF v_actor_role IS NULL
     OR v_actor_role NOT IN ('super_admin', 'client_admin')
     OR (v_actor_role <> 'super_admin' AND v_actor_client_id IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_job
  FROM job_ads
  WHERE id = p_job_ad_id AND client_id = p_client_id
  FOR UPDATE;
  IF NOT FOUND OR v_job.status <> 'approved' OR v_job.company_id IS NULL THEN
    RAISE EXCEPTION 'approved job with linked company required' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_company
  FROM lead_companies
  WHERE id = v_job.company_id AND client_id = p_client_id
  FOR SHARE;
  IF NOT FOUND OR v_company.status <> 'approved' THEN
    RAISE EXCEPTION 'approved company required' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_profile
  FROM lead_scoring_profiles
  WHERE id = (p_payload->>'scoring_profile_id')::UUID
    AND client_id = p_client_id
  FOR SHARE;
  IF NOT FOUND
     OR v_profile.version <> (p_payload->>'profile_version')::INTEGER
     OR v_job.extraction_hash IS DISTINCT FROM p_payload->>'job_extraction_hash'
     OR v_company.enrichment_hash IS DISTINCT FROM p_payload->>'company_enrichment_hash' THEN
    RAISE EXCEPTION 'score inputs changed before save' USING ERRCODE = '40001';
  END IF;

  WITH expected(component, max_points) AS (
    VALUES
      ('target_role'::TEXT, 25),
      ('target_geography'::TEXT, 15),
      ('advertisement_recency'::TEXT, 15),
      ('hiring_urgency'::TEXT, 15),
      ('company_fit'::TEXT, 10),
      ('outsourcing_suitability'::TEXT, 10),
      ('data_completeness_confidence'::TEXT, 10)
  ),
  supplied AS (
    SELECT component.component, component.points, component.max_points,
           component.reason, component.inputs
    FROM jsonb_to_recordset(p_payload->'components') AS component(
      component TEXT,
      points INTEGER,
      max_points INTEGER,
      reason TEXT,
      inputs JSONB
    )
  )
  SELECT
    count(*)::INTEGER,
    count(DISTINCT supplied.component)::INTEGER,
    COALESCE(sum(supplied.points), 0)::INTEGER,
    COALESCE(bool_and(
      expected.component IS NOT NULL
      AND supplied.max_points = expected.max_points
      AND supplied.points BETWEEN 0 AND expected.max_points
      AND NULLIF(supplied.reason, '') IS NOT NULL
      AND jsonb_typeof(COALESCE(supplied.inputs, '{}'::JSONB)) = 'object'
    ), false)
  INTO
    v_component_count,
    v_component_distinct_count,
    v_component_total,
    v_components_valid
  FROM supplied
  LEFT JOIN expected USING (component);

  IF v_component_count <> 7
     OR v_component_distinct_count <> 7
     OR NOT v_components_valid
     OR v_component_total <> (p_payload->>'total_score')::INTEGER
     OR v_component_total NOT BETWEEN 0 AND 100
     OR (
       CASE
         WHEN v_component_total >= 75 THEN 'high'
         WHEN v_component_total >= 50 THEN 'medium'
         ELSE 'low'
       END
     ) <> p_payload->>'score_band' THEN
    RAISE EXCEPTION 'component totals or bands are invalid' USING ERRCODE = '22023';
  END IF;

  INSERT INTO lead_scores (
    client_id, job_ad_id, company_id, scoring_profile_id, ruleset_version,
    profile_version, input_hash, job_extraction_hash, company_enrichment_hash,
    total_score, score_band, summary, created_by
  )
  VALUES (
    p_client_id,
    p_job_ad_id,
    v_company.id,
    v_profile.id,
    p_payload->>'ruleset_version',
    v_profile.version,
    p_payload->>'input_hash',
    v_job.extraction_hash,
    v_company.enrichment_hash,
    v_component_total,
    p_payload->>'score_band',
    left(p_payload->>'summary', 1000),
    p_actor_id
  )
  ON CONFLICT (client_id, job_ad_id, ruleset_version, input_hash) DO NOTHING
  RETURNING * INTO v_saved;
  v_inserted := FOUND;

  IF NOT v_inserted THEN
    SELECT * INTO v_saved
    FROM lead_scores
    WHERE client_id = p_client_id
      AND job_ad_id = p_job_ad_id
      AND ruleset_version = p_payload->>'ruleset_version'
      AND input_hash = p_payload->>'input_hash';
  ELSE
    INSERT INTO lead_score_components (
      client_id, lead_score_id, component, points, max_points, reason, inputs
    )
    SELECT
      p_client_id,
      v_saved.id,
      component.component,
      component.points,
      component.max_points,
      left(component.reason, 2000),
      COALESCE(component.inputs, '{}'::JSONB)
    FROM jsonb_to_recordset(p_payload->'components') AS component(
      component TEXT,
      points INTEGER,
      max_points INTEGER,
      reason TEXT,
      inputs JSONB
    );
  END IF;

  UPDATE job_ads
  SET lead_score_id = v_saved.id, updated_at = now()
  WHERE id = p_job_ad_id AND client_id = p_client_id;

  RETURN NEXT v_saved;
END;
$$;

REVOKE ALL ON FUNCTION save_transparent_lead_score(UUID, UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION save_transparent_lead_score(UUID, UUID, UUID, JSONB)
  TO service_role;

COMMENT ON TABLE lead_scores IS
  'Versioned deterministic lead scores. Totals are derived only from transparent rule components.';
COMMENT ON TABLE lead_score_components IS
  'Per-component points, maximums, inputs, and human-readable reasons for each lead score.';

SELECT json_build_object(
  'migration_complete',
    to_regclass('public.lead_scoring_profiles') IS NOT NULL
    AND to_regclass('public.lead_scores') IS NOT NULL
    AND to_regclass('public.lead_score_components') IS NOT NULL
    AND to_regprocedure('public.initialize_lead_scoring_profile()') IS NOT NULL
    AND to_regprocedure(
      'public.update_lead_scoring_profile(uuid,uuid,text[],text[],text[],text[])'
    ) IS NOT NULL
    AND to_regprocedure(
      'public.save_transparent_lead_score(uuid,uuid,uuid,jsonb)'
    ) IS NOT NULL,
  'installed_tables', ARRAY[
    'lead_scoring_profiles',
    'lead_scores',
    'lead_score_components'
  ],
  'installed_functions', ARRAY[
    'initialize_lead_scoring_profile',
    'update_lead_scoring_profile',
    'save_transparent_lead_score'
  ],
  'ruleset', 'phase4-v1'
) AS rapidtal_phase_4_result;
