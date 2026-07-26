-- ============================================================
-- 028_testing_and_observability.sql
-- Phase 7: labeled extraction quality, operational metrics,
-- deduplicated provider alerts, and tenant-safe observability.
-- Run after 027_automated_job_discovery.sql.
-- ============================================================

ALTER TABLE job_scrape_runs
  ADD COLUMN IF NOT EXISTS provider_cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0
    CHECK (provider_cost_usd >= 0),
  ADD COLUMN IF NOT EXISTS ai_estimated_cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0
    CHECK (ai_estimated_cost_usd >= 0);

CREATE TABLE IF NOT EXISTS job_extraction_quality_measurements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_ad_id         UUID REFERENCES job_ads(id) ON DELETE SET NULL,
  scrape_run_id     UUID REFERENCES job_scrape_runs(id) ON DELETE SET NULL,
  fixture_key       TEXT NOT NULL CHECK (length(fixture_key) BETWEEN 1 AND 120),
  fixture_kind      TEXT NOT NULL CHECK (
                      fixture_kind IN ('structured', 'dynamic', 'incomplete', 'expired', 'production_sample')
                    ),
  expected_fields   JSONB NOT NULL CHECK (jsonb_typeof(expected_fields) = 'object'),
  actual_fields     JSONB NOT NULL CHECK (jsonb_typeof(actual_fields) = 'object'),
  matched_fields    INTEGER NOT NULL CHECK (matched_fields >= 0),
  measured_fields   INTEGER NOT NULL CHECK (measured_fields > 0),
  field_accuracy    NUMERIC(5,4) NOT NULL CHECK (field_accuracy BETWEEN 0 AND 1),
  measured_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  measured_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT job_extraction_quality_count_contract
    CHECK (matched_fields <= measured_fields)
);

CREATE INDEX IF NOT EXISTS job_extraction_quality_client_measured_idx
  ON job_extraction_quality_measurements (client_id, measured_at DESC);

CREATE TABLE IF NOT EXISTS job_pipeline_alerts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  stage             TEXT NOT NULL CHECK (
                      stage IN ('ingestion', 'discovery', 'company_enrichment')
                    ),
  provider          TEXT NOT NULL,
  alert_type        TEXT NOT NULL CHECK (
                      alert_type IN ('provider_error', 'repeated_failure')
                    ),
  severity          TEXT NOT NULL CHECK (severity IN ('warning', 'critical')),
  fingerprint       TEXT NOT NULL,
  title             TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  detail            TEXT NOT NULL CHECK (length(detail) BETWEEN 1 AND 1000),
  context           JSONB NOT NULL DEFAULT '{}'::JSONB
                      CHECK (jsonb_typeof(context) = 'object'),
  occurrence_count  INTEGER NOT NULL DEFAULT 1 CHECK (occurrence_count > 0),
  first_seen_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  status            TEXT NOT NULL DEFAULT 'open'
                      CHECK (status IN ('open', 'acknowledged', 'resolved')),
  acknowledged_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  acknowledged_at   TIMESTAMPTZ,
  resolved_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at       TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS job_pipeline_alerts_open_fingerprint_idx
  ON job_pipeline_alerts (client_id, fingerprint)
  WHERE status = 'open';
CREATE INDEX IF NOT EXISTS job_pipeline_alerts_client_status_seen_idx
  ON job_pipeline_alerts (client_id, status, last_seen_at DESC);

ALTER TABLE job_extraction_quality_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_pipeline_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_extraction_quality_super_admin_select"
  ON job_extraction_quality_measurements FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "job_extraction_quality_own_client_select"
  ON job_extraction_quality_measurements FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );
CREATE POLICY "job_pipeline_alerts_super_admin_select"
  ON job_pipeline_alerts FOR SELECT
  USING (current_user_role() = 'super_admin');
CREATE POLICY "job_pipeline_alerts_own_client_select"
  ON job_pipeline_alerts FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

GRANT SELECT ON job_extraction_quality_measurements, job_pipeline_alerts TO authenticated;
REVOKE INSERT, UPDATE, DELETE
  ON job_extraction_quality_measurements, job_pipeline_alerts
  FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON job_pipeline_alerts TO service_role;
GRANT SELECT, INSERT ON job_extraction_quality_measurements TO service_role;
REVOKE DELETE ON job_extraction_quality_measurements, job_pipeline_alerts FROM service_role;

CREATE OR REPLACE FUNCTION record_job_pipeline_failure_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_stage TEXT;
  v_provider TEXT;
  v_recent_failures INTEGER;
  v_alert_type TEXT;
  v_fingerprint TEXT;
  v_error_code TEXT := COALESCE(NEW.error_code, 'unknown_provider_error');
BEGIN
  IF NEW.status <> 'failed' OR (TG_OP = 'UPDATE' AND OLD.status = 'failed') THEN
    RETURN NEW;
  END IF;

  v_stage := CASE TG_TABLE_NAME
    WHEN 'job_scrape_runs' THEN 'ingestion'
    WHEN 'job_discovery_runs' THEN 'discovery'
    WHEN 'company_enrichment_runs' THEN 'company_enrichment'
  END;
  IF v_stage IS NULL THEN RETURN NEW; END IF;
  v_provider := CASE
    WHEN v_stage = 'ingestion'
      AND v_error_code IN ('ai_not_configured', 'ai_failed', 'invalid_ai_output')
      THEN 'openai'
    ELSE NEW.provider
  END;

  IF TG_TABLE_NAME = 'job_scrape_runs' THEN
    SELECT count(*) INTO v_recent_failures
    FROM job_scrape_runs
    WHERE client_id = NEW.client_id
      AND status = 'failed'
      AND started_at >= now() - interval '60 minutes'
      AND (
        (
          v_provider = 'openai'
          AND error_code IN ('ai_not_configured', 'ai_failed', 'invalid_ai_output')
        )
        OR (
          v_provider <> 'openai'
          AND provider = NEW.provider
          AND COALESCE(error_code, '') NOT IN (
            'ai_not_configured', 'ai_failed', 'invalid_ai_output'
          )
        )
      );
  ELSIF TG_TABLE_NAME = 'job_discovery_runs' THEN
    SELECT count(*) INTO v_recent_failures
    FROM job_discovery_runs
    WHERE client_id = NEW.client_id
      AND provider = NEW.provider
      AND status = 'failed'
      AND started_at >= now() - interval '60 minutes';
  ELSE
    SELECT count(*) INTO v_recent_failures
    FROM company_enrichment_runs
    WHERE client_id = NEW.client_id
      AND provider = NEW.provider
      AND status = 'failed'
      AND started_at >= now() - interval '60 minutes';
  END IF;

  v_alert_type := CASE WHEN v_recent_failures >= 3
    THEN 'repeated_failure' ELSE 'provider_error' END;
  v_fingerprint := v_stage || ':' || v_provider || ':' || v_alert_type || ':' || v_error_code;

  INSERT INTO job_pipeline_alerts (
    client_id, stage, provider, alert_type, severity, fingerprint,
    title, detail, context
  )
  VALUES (
    NEW.client_id,
    v_stage,
    v_provider,
    v_alert_type,
    CASE WHEN v_alert_type = 'repeated_failure' THEN 'critical' ELSE 'warning' END,
    v_fingerprint,
    CASE WHEN v_alert_type = 'repeated_failure'
      THEN 'Repeated ' || v_stage || ' failures'
      ELSE initcap(replace(v_stage, '_', ' ')) || ' provider error'
    END,
    CASE WHEN v_alert_type = 'repeated_failure'
      THEN v_recent_failures || ' failures occurred for ' || v_provider || ' in the last hour.'
      ELSE v_provider || ' failed with code ' || v_error_code || '.'
    END,
    jsonb_build_object(
      'run_id', NEW.id,
      'error_code', v_error_code,
      'recent_failure_count', v_recent_failures
    )
  )
  ON CONFLICT (client_id, fingerprint) WHERE status = 'open'
  DO UPDATE SET
    occurrence_count = job_pipeline_alerts.occurrence_count + 1,
    last_seen_at = now(),
    detail = EXCLUDED.detail,
    context = EXCLUDED.context;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS job_scrape_runs_failure_alert ON job_scrape_runs;
CREATE TRIGGER job_scrape_runs_failure_alert
  AFTER INSERT OR UPDATE OF status ON job_scrape_runs
  FOR EACH ROW EXECUTE FUNCTION record_job_pipeline_failure_alert();
DROP TRIGGER IF EXISTS job_discovery_runs_failure_alert ON job_discovery_runs;
CREATE TRIGGER job_discovery_runs_failure_alert
  AFTER INSERT OR UPDATE OF status ON job_discovery_runs
  FOR EACH ROW EXECUTE FUNCTION record_job_pipeline_failure_alert();
DROP TRIGGER IF EXISTS company_enrichment_runs_failure_alert ON company_enrichment_runs;
CREATE TRIGGER company_enrichment_runs_failure_alert
  AFTER INSERT OR UPDATE OF status ON company_enrichment_runs
  FOR EACH ROW EXECUTE FUNCTION record_job_pipeline_failure_alert();

REVOKE ALL ON FUNCTION record_job_pipeline_failure_alert() FROM PUBLIC, authenticated;

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
  v_measured INTEGER := (p_payload->>'measured_fields')::INTEGER;
  v_matched INTEGER := (p_payload->>'matched_fields')::INTEGER;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  SELECT role, client_id INTO v_role, v_actor_client FROM users WHERE id = p_actor_id;
  IF v_role IS NULL OR v_role NOT IN ('super_admin', 'client_admin')
     OR (v_role <> 'super_admin' AND v_actor_client IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;
  IF p_payload IS NULL OR jsonb_typeof(p_payload) <> 'object'
     OR v_measured <= 0 OR v_matched < 0 OR v_matched > v_measured THEN
    RAISE EXCEPTION 'invalid quality measurement' USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
  INSERT INTO job_extraction_quality_measurements (
    client_id, job_ad_id, scrape_run_id, fixture_key, fixture_kind,
    expected_fields, actual_fields, matched_fields, measured_fields,
    field_accuracy, measured_by
  ) VALUES (
    p_client_id,
    NULLIF(p_payload->>'job_ad_id', '')::UUID,
    NULLIF(p_payload->>'scrape_run_id', '')::UUID,
    p_payload->>'fixture_key',
    p_payload->>'fixture_kind',
    COALESCE(p_payload->'expected_fields', '{}'::JSONB),
    COALESCE(p_payload->'actual_fields', '{}'::JSONB),
    v_matched,
    v_measured,
    v_matched::NUMERIC / v_measured,
    p_actor_id
  )
  RETURNING *;
END;
$$;

CREATE OR REPLACE FUNCTION review_job_pipeline_alert(
  p_actor_id UUID,
  p_client_id UUID,
  p_alert_id UUID,
  p_action TEXT
)
RETURNS SETOF job_pipeline_alerts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role TEXT;
  v_actor_client UUID;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  SELECT role, client_id INTO v_role, v_actor_client FROM users WHERE id = p_actor_id;
  IF v_role IS NULL OR v_role NOT IN ('super_admin', 'client_admin')
     OR (v_role <> 'super_admin' AND v_actor_client IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;
  IF p_action NOT IN ('acknowledged', 'resolved') THEN
    RAISE EXCEPTION 'invalid alert action' USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
  UPDATE job_pipeline_alerts
  SET
    status = p_action,
    acknowledged_by = CASE WHEN p_action = 'acknowledged' THEN p_actor_id ELSE acknowledged_by END,
    acknowledged_at = CASE WHEN p_action = 'acknowledged' THEN now() ELSE acknowledged_at END,
    resolved_by = CASE WHEN p_action = 'resolved' THEN p_actor_id ELSE resolved_by END,
    resolved_at = CASE WHEN p_action = 'resolved' THEN now() ELSE resolved_at END
  WHERE id = p_alert_id AND client_id = p_client_id AND status <> 'resolved'
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION save_job_extraction_quality_measurement(UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION save_job_extraction_quality_measurement(UUID, UUID, JSONB)
  TO service_role;
REVOKE ALL ON FUNCTION review_job_pipeline_alert(UUID, UUID, UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION review_job_pipeline_alert(UUID, UUID, UUID, TEXT)
  TO service_role;

DO $$
DECLARE
  missing TEXT[];
BEGIN
  SELECT array_agg(name ORDER BY name) INTO missing
  FROM unnest(ARRAY[
    'public.job_extraction_quality_measurements',
    'public.job_pipeline_alerts',
    'public.save_job_extraction_quality_measurement(uuid,uuid,jsonb)',
    'public.review_job_pipeline_alert(uuid,uuid,uuid,text)'
  ]) AS required(name)
  WHERE to_regclass(name) IS NULL AND to_regprocedure(name) IS NULL;
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'Phase 7 migration incomplete: %', array_to_string(missing, ', ');
  END IF;
END;
$$;

SELECT jsonb_build_object(
  'migration_complete', true,
  'installed_tables', ARRAY[
    'job_extraction_quality_measurements',
    'job_pipeline_alerts'
  ],
  'installed_functions', ARRAY[
    'save_job_extraction_quality_measurement',
    'review_job_pipeline_alert',
    'record_job_pipeline_failure_alert'
  ],
  'release_gate', 'fixtures_mocks_tenant_isolation_metrics_alerts_deduplication'
) AS rapidtal_phase_7_result;
