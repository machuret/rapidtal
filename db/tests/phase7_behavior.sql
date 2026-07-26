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
    "source_job_id":"SOURCE-IDENTITY-42",
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
    "source_job_id":"EXPIRED-SOURCE-1",
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

-- A changed URL with the same source job ID must resolve to the original job.
SELECT *
FROM upsert_job_ad_extraction(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '{
    "source_url":"https://jobs.example.com/phase7/alias-by-source-id",
    "canonical_url":"https://jobs.example.com/phase7/alias-by-source-id",
    "source_host":"jobs.example.com",
    "source_job_id":"SOURCE-IDENTITY-42",
    "title":"Sales Manager",
    "company_name":"Idempotent Pty Ltd",
    "company_website":"https://idempotent.example",
    "remote_type":"onsite",
    "description":"Lead the national sales team and own sustainable revenue growth across the Australian market.",
    "responsibilities":["Lead sales"],
    "skills":["Sales"],
    "apply_url":"https://jobs.example.com/phase7/alias-by-source-id",
    "raw_content":"fixture-content-updated",
    "raw_content_hash":"content-hash-2",
    "extraction_hash":"extraction-hash-2",
    "extraction_method":"json_ld",
    "extraction_confidence":0.95,
    "field_evidence":{}
  }'::JSONB
);

-- A third URL with a previously claimed exact content fingerprint must also
-- resolve to the original job, even without a source job ID.
SELECT *
FROM upsert_job_ad_extraction(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  '{
    "source_url":"https://mirror.example.com/jobs/sales-manager",
    "canonical_url":"https://mirror.example.com/jobs/sales-manager",
    "source_host":"mirror.example.com",
    "title":"Sales Manager",
    "company_name":"Idempotent Pty Ltd",
    "company_website":"https://idempotent.example",
    "remote_type":"onsite",
    "description":"Lead the national sales team and own sustainable revenue growth across the Australian market.",
    "responsibilities":["Lead sales"],
    "skills":["Sales"],
    "apply_url":"https://mirror.example.com/jobs/sales-manager",
    "raw_content":"fixture-content",
    "raw_content_hash":"content-hash-1",
    "extraction_hash":"extraction-hash-1",
    "extraction_method":"json_ld",
    "extraction_confidence":0.95,
    "field_evidence":{}
  }'::JSONB
);

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

-- Enrichment and transparent scoring are evidence-building steps and must work
-- before final approval. CRM promotion must remain blocked at this point.
SELECT *
FROM save_transparent_lead_score(
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000001',
  (
    SELECT id FROM job_ads
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND canonical_url = 'https://jobs.example.com/phase7/idempotent'
  ),
  jsonb_build_object(
    'scoring_profile_id', (
      SELECT id FROM lead_scoring_profiles
      WHERE client_id = '20000000-0000-4000-8000-000000000001'
    ),
    'profile_version', (
      SELECT version FROM lead_scoring_profiles
      WHERE client_id = '20000000-0000-4000-8000-000000000001'
    ),
    'ruleset_version', 'phase4-v1',
    'input_hash', repeat('a', 64),
    'job_extraction_hash', 'extraction-hash-1',
    'company_enrichment_hash', 'company-hash-1',
    'total_score', 70,
    'score_band', 'medium',
    'summary', 'Fixture score before final review.',
    'components', '[
      {"component":"target_role","points":20,"max_points":25,"reason":"Strong role match.","inputs":{}},
      {"component":"target_geography","points":10,"max_points":15,"reason":"Target geography.","inputs":{}},
      {"component":"advertisement_recency","points":10,"max_points":15,"reason":"Recent advertisement.","inputs":{}},
      {"component":"hiring_urgency","points":10,"max_points":15,"reason":"Hiring signal.","inputs":{}},
      {"component":"company_fit","points":8,"max_points":10,"reason":"Company fit.","inputs":{}},
      {"component":"outsourcing_suitability","points":7,"max_points":10,"reason":"Placement fit.","inputs":{}},
      {"component":"data_completeness_confidence","points":5,"max_points":10,"reason":"Evidence quality.","inputs":{}}
    ]'::JSONB
  )
);

DO $$
DECLARE
  v_job job_ads%ROWTYPE;
BEGIN
  SELECT * INTO v_job
  FROM job_ads
  WHERE client_id = '20000000-0000-4000-8000-000000000001'
    AND canonical_url = 'https://jobs.example.com/phase7/idempotent';
  IF v_job.status <> 'needs_review' OR v_job.lead_score_id IS NULL THEN
    RAISE EXCEPTION 'Pre-review transparent scoring did not complete';
  END IF;

  BEGIN
    PERFORM promote_lead_company_to_crm(
      '10000000-0000-4000-8000-000000000001',
      '20000000-0000-4000-8000-000000000001',
      v_job.id,
      v_job.company_id
    );
    RAISE EXCEPTION 'Unreviewed job reached CRM promotion';
  EXCEPTION WHEN SQLSTATE 'P0002' THEN
    NULL;
  END;
END;
$$;

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
    SELECT count(*) FROM job_ads
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND canonical_url <> 'https://jobs.example.com/phase7/expired'
  ) <> 1 THEN
    RAISE EXCEPTION 'Source ID or content alias created a duplicate job';
  END IF;
  IF (
    SELECT count(DISTINCT job_ad_id)
    FROM job_ad_identities
    WHERE client_id = '20000000-0000-4000-8000-000000000001'
      AND (
        identity_value = 'https://jobs.example.com/phase7/alias-by-source-id'
        OR identity_value = 'jobs.example.com:SOURCE-IDENTITY-42'
        OR identity_value = 'https://mirror.example.com/jobs/sales-manager'
        OR identity_value = 'content-hash-1'
      )
  ) <> 1 THEN
    RAISE EXCEPTION 'Job identity aliases did not converge on one record';
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
