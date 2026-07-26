\set ON_ERROR_STOP on

BEGIN;

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID
$$;

INSERT INTO auth.users (id, email) VALUES
  ('10000000-0000-4000-8000-000000000001', 'admin-a@example.test'),
  ('10000000-0000-4000-8000-000000000002', 'admin-b@example.test');
INSERT INTO clients (id, name, slug) VALUES
  ('20000000-0000-4000-8000-000000000001', 'Tenant A', 'phase7-tenant-a'),
  ('20000000-0000-4000-8000-000000000002', 'Tenant B', 'phase7-tenant-b');
INSERT INTO users (id, email, role, client_id) VALUES
  (
    '10000000-0000-4000-8000-000000000001',
    'admin-a@example.test',
    'client_admin',
    '20000000-0000-4000-8000-000000000001'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'admin-b@example.test',
    'client_admin',
    '20000000-0000-4000-8000-000000000002'
  );

SELECT set_config('request.jwt.claim.role', 'service_role', true);

SELECT *
FROM upsert_job_ad_extraction(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '{
    "source_url":"https://jobs.example.com/phase7/idempotent",
    "canonical_url":"https://jobs.example.com/phase7/idempotent",
    "source_host":"jobs.example.com",
    "title":"Sales Manager",
    "company_name":"Idempotent Pty Ltd",
    "company_website":"https://idempotent.example",
    "remote_type":"onsite",
    "description":"Lead the national sales team and own sustainable revenue growth across the Australian market.",
    "responsibilities":["Lead sales"],
    "skills":["Sales"],
    "apply_url":"https://jobs.example.com/phase7/idempotent",
    "raw_content":"fixture-content",
    "raw_content_hash":"content-hash-1",
    "extraction_hash":"extraction-hash-1",
    "extraction_method":"json_ld",
    "extraction_confidence":0.95,
    "field_evidence":{}
  }'::JSONB
);

SELECT *
FROM upsert_job_ad_extraction(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '{
    "source_url":"https://jobs.example.com/phase7/expired",
    "canonical_url":"https://jobs.example.com/phase7/expired",
    "source_host":"jobs.example.com",
    "title":"Expired Sales Role",
    "company_name":"Expired Fixture Pty Ltd",
    "remote_type":"onsite",
    "description":"This expired fixture has a complete description and must enter the expired lifecycle automatically.",
    "responsibilities":["Sell"],
    "skills":["Sales"],
    "expires_at":"2025-01-31T00:00:00Z",
    "apply_url":"https://jobs.example.com/phase7/expired",
    "raw_content":"expired-fixture-content",
    "raw_content_hash":"expired-content-hash",
    "extraction_hash":"expired-extraction-hash",
    "extraction_method":"json_ld",
    "extraction_confidence":0.95,
    "field_evidence":{}
  }'::JSONB
);
SELECT *
FROM upsert_job_ad_extraction(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '{
    "source_url":"https://jobs.example.com/phase7/idempotent",
    "canonical_url":"https://jobs.example.com/phase7/idempotent",
    "source_host":"jobs.example.com",
    "title":"Sales Manager",
    "company_name":"Idempotent Pty Ltd",
    "company_website":"https://idempotent.example",
    "remote_type":"onsite",
    "description":"Lead the national sales team and own sustainable revenue growth across the Australian market.",
    "responsibilities":["Lead sales"],
    "skills":["Sales"],
    "apply_url":"https://jobs.example.com/phase7/idempotent",
    "raw_content":"fixture-content",
    "raw_content_hash":"content-hash-1",
    "extraction_hash":"extraction-hash-1",
    "extraction_method":"json_ld",
    "extraction_confidence":0.95,
    "field_evidence":{}
  }'::JSONB
);

UPDATE job_ads
SET status = 'approved'
WHERE client_id = '20000000-0000-4000-8000-000000000001'
  AND canonical_url = 'https://jobs.example.com/phase7/idempotent';

INSERT INTO company_enrichment_runs (
  id, client_id, job_ad_id, status, created_by, input_hash, model, prompt_version
)
SELECT
  '30000000-0000-4000-8000-000000000001',
  client_id,
  id,
  'running',
  '10000000-0000-4000-8000-000000000001',
  'company-input-1',
  'fixture-model',
  'phase7-fixture-v1'
FROM job_ads
WHERE client_id = '20000000-0000-4000-8000-000000000001'
  AND canonical_url = 'https://jobs.example.com/phase7/idempotent';

SELECT *
FROM upsert_lead_company_enrichment(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  (
    SELECT id FROM job_ads
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND canonical_url = 'https://jobs.example.com/phase7/idempotent'
  ),
  '30000000-0000-4000-8000-000000000001',
  '{
    "domain":"idempotent.example",
    "website_url":"https://idempotent.example",
    "name":"Idempotent Pty Ltd",
    "services":["Sales"],
    "source_backed_data":{"name":"Idempotent Pty Ltd"},
    "inferred_data":{},
    "evidence":{},
    "enrichment_hash":"company-hash-1",
    "input_hash":"company-input-1",
    "model":"fixture-model",
    "prompt_version":"phase7-fixture-v1",
    "resolution_method":"job_ad",
    "facts":[]
  }'::JSONB
);

INSERT INTO company_enrichment_runs (
  id, client_id, job_ad_id, status, created_by, input_hash, model, prompt_version
)
SELECT
  '30000000-0000-4000-8000-000000000002',
  client_id,
  id,
  'running',
  '10000000-0000-4000-8000-000000000001',
  'company-input-1',
  'fixture-model',
  'phase7-fixture-v1'
FROM job_ads
WHERE client_id = '20000000-0000-4000-8000-000000000001'
  AND canonical_url = 'https://jobs.example.com/phase7/idempotent';

SELECT *
FROM upsert_lead_company_enrichment(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  (
    SELECT id FROM job_ads
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND canonical_url = 'https://jobs.example.com/phase7/idempotent'
  ),
  '30000000-0000-4000-8000-000000000002',
  '{
    "domain":"idempotent.example",
    "website_url":"https://idempotent.example",
    "name":"Idempotent Pty Ltd",
    "services":["Sales"],
    "source_backed_data":{"name":"Idempotent Pty Ltd"},
    "inferred_data":{},
    "evidence":{},
    "enrichment_hash":"company-hash-1",
    "input_hash":"company-input-1",
    "model":"fixture-model",
    "prompt_version":"phase7-fixture-v1",
    "resolution_method":"job_ad",
    "facts":[]
  }'::JSONB
);

INSERT INTO job_scrape_runs (
  client_id, requested_url, status, provider, error_code, completed_at
)
VALUES (
  '20000000-0000-4000-8000-000000000001',
  'https://jobs.example.com/phase7/failure-1',
  'failed',
  'apify',
  'provider_timeout',
  now()
);
INSERT INTO job_scrape_runs (
  client_id, requested_url, status, provider, error_code, completed_at
)
SELECT
  '20000000-0000-4000-8000-000000000001',
  'https://jobs.example.com/phase7/failure-' || number,
  'failed',
  'apify',
  'provider_timeout',
  now()
FROM generate_series(2, 3) AS number;

INSERT INTO job_scrape_runs (
  id, client_id, requested_url, status, provider, completed_at
) VALUES (
  '50000000-0000-4000-8000-000000000002',
  '20000000-0000-4000-8000-000000000002',
  'https://jobs.example.com/tenant-b/run',
  'completed',
  'apify',
  now()
);

SELECT *
FROM save_job_extraction_quality_measurement(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  jsonb_build_object(
    'job_ad_id', (
      SELECT id FROM job_ads
      WHERE client_id = '20000000-0000-4000-8000-000000000001'
        AND canonical_url = 'https://jobs.example.com/phase7/idempotent'
    ),
    'fixture_key', 'phase7-database-quality',
    'fixture_kind', 'production_sample',
    'expected_fields', '{"title":"Sales Manager","location":"Sydney"}'::JSONB,
    'actual_fields', '{"title":"Sales Manager","location":"Melbourne"}'::JSONB,
    'matched_fields', 2,
    'measured_fields', 2
  )
);

DO $$
BEGIN
  IF (
    SELECT count(*) FROM job_ads
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND canonical_url = 'https://jobs.example.com/phase7/idempotent'
  ) <> 1 THEN
    RAISE EXCEPTION 'Repeated ingestion created a duplicate job';
  END IF;
  IF (
    SELECT count(*) FROM lead_companies
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND domain = 'idempotent.example'
  ) <> 1 THEN
    RAISE EXCEPTION 'Repeated enrichment created a duplicate company';
  END IF;
  IF (
    SELECT status FROM job_ads
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND canonical_url = 'https://jobs.example.com/phase7/expired'
  ) <> 'expired' THEN
    RAISE EXCEPTION 'Expired ingestion did not enter the expired lifecycle';
  END IF;
  IF (
    SELECT field_accuracy FROM job_extraction_quality_measurements
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND fixture_key = 'phase7-database-quality'
  ) <> 0.5 THEN
    RAISE EXCEPTION 'Database did not compute labeled accuracy from field values';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM job_pipeline_alerts
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND alert_type = 'provider_error'
      AND status = 'open'
  ) THEN
    RAISE EXCEPTION 'Provider failure alert was not created';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM job_pipeline_alerts
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND alert_type = 'repeated_failure'
      AND severity = 'critical'
      AND status = 'open'
  ) THEN
    RAISE EXCEPTION 'Repeated failure escalation was not created';
  END IF;

  BEGIN
    PERFORM save_job_extraction_quality_measurement(
      '10000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      '{
        "scrape_run_id":"50000000-0000-4000-8000-000000000002",
        "fixture_key":"cross-tenant",
        "fixture_kind":"production_sample",
        "expected_fields":{"title":"Role"},
        "actual_fields":{"title":"Role"}
      }'::JSONB
    );
    RAISE EXCEPTION 'Cross-tenant quality provenance was accepted';
  EXCEPTION WHEN SQLSTATE 'P0002' THEN
    NULL;
  END;

  BEGIN
    PERFORM review_job_ad(
      '10000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      (
        SELECT id FROM job_ads
        WHERE client_id = '20000000-0000-4000-8000-000000000001'
          AND canonical_url = 'https://jobs.example.com/phase7/expired'
      ),
      'approved',
      NULL
    );
    RAISE EXCEPTION 'Expired job review was accepted';
  EXCEPTION WHEN SQLSTATE '22023' THEN
    NULL;
  END;
END;
$$;

SELECT set_config('request.jwt.claim.role', 'authenticated', true);
SELECT set_config(
  'request.jwt.claim.sub',
  '10000000-0000-4000-8000-000000000002',
  true
);
SET LOCAL ROLE authenticated;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM job_pipeline_alerts
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
  ) THEN
    RAISE EXCEPTION 'Tenant B can read Tenant A alerts';
  END IF;
  IF EXISTS (
    SELECT 1 FROM job_ads
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
  ) THEN
    RAISE EXCEPTION 'Tenant B can read Tenant A jobs';
  END IF;
END;
$$;

RESET ROLE;
ROLLBACK;

SELECT 'phase7_behavior_ok' AS result;
