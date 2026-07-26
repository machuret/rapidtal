-- ============================================================
-- 025_review_and_crm_promotion.sql
-- Phase 5: approval-gated CRM company promotion and verified contacts.
-- Run after 024_transparent_lead_scoring.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS crm_companies (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_company_id          UUID NOT NULL REFERENCES lead_companies(id) ON DELETE RESTRICT,
  source_job_ad_id         UUID REFERENCES job_ads(id) ON DELETE SET NULL,
  source_lead_score_id     UUID REFERENCES lead_scores(id) ON DELETE SET NULL,
  source_enrichment_hash   TEXT NOT NULL,
  name                     TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 300),
  domain                   TEXT NOT NULL,
  website_url              TEXT NOT NULL CHECK (website_url ~ '^https://'),
  industry                 TEXT,
  location                 TEXT,
  services                 TEXT[] NOT NULL DEFAULT '{}',
  description              TEXT,
  source_score_total       INTEGER CHECK (source_score_total BETWEEN 0 AND 100),
  source_score_band        TEXT CHECK (
                             source_score_band IS NULL
                             OR source_score_band IN ('high', 'medium', 'low')
                           ),
  source_score_summary     TEXT,
  status                   TEXT NOT NULL DEFAULT 'prospect'
                             CHECK (status IN ('prospect', 'active', 'inactive', 'closed')),
  promoted_by              UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  promoted_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT crm_companies_client_lead_company_key UNIQUE (client_id, lead_company_id),
  CONSTRAINT crm_companies_client_domain_key UNIQUE (client_id, domain),
  CONSTRAINT crm_companies_domain_normalized CHECK (
    domain = lower(domain)
    AND domain ~ '^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$'
  )
);

CREATE TABLE IF NOT EXISTS crm_company_promotion_events (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_company_id          UUID NOT NULL REFERENCES lead_companies(id) ON DELETE RESTRICT,
  crm_company_id           UUID NOT NULL REFERENCES crm_companies(id) ON DELETE RESTRICT,
  job_ad_id                UUID NOT NULL REFERENCES job_ads(id) ON DELETE RESTRICT,
  lead_score_id            UUID REFERENCES lead_scores(id) ON DELETE SET NULL,
  enrichment_hash          TEXT NOT NULL,
  promoted_by              UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  promoted_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE crm_contacts
  ADD COLUMN IF NOT EXISTS crm_company_id UUID
    REFERENCES crm_companies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'verified', 'rejected')),
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'crm_contacts_verified_state_contract'
      AND conrelid = 'public.crm_contacts'::regclass
  ) THEN
    ALTER TABLE crm_contacts
      ADD CONSTRAINT crm_contacts_verified_state_contract CHECK (
        (
          verification_status = 'verified'
          AND verified_by IS NOT NULL
          AND verified_at IS NOT NULL
        )
        OR (
          verification_status <> 'verified'
          AND verified_by IS NULL
          AND verified_at IS NULL
        )
      );
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS crm_contact_verifications (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id            UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  contact_id           UUID REFERENCES crm_contacts(id) ON DELETE SET NULL,
  crm_company_id       UUID NOT NULL REFERENCES crm_companies(id) ON DELETE RESTRICT,
  verification_method  TEXT NOT NULL CHECK (
                         verification_method IN (
                           'company_website',
                           'linkedin',
                           'email',
                           'phone',
                           'manual_research'
                         )
                       ),
  source_url           TEXT NOT NULL CHECK (source_url ~ '^https://'),
  evidence_note        TEXT NOT NULL CHECK (length(evidence_note) BETWEEN 1 AND 2000),
  verified_name        TEXT NOT NULL,
  verified_email       TEXT,
  verified_phone       TEXT,
  verified_job_title   TEXT,
  verified_by          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  verified_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crm_companies_client_status_promoted_idx
  ON crm_companies (client_id, status, promoted_at DESC);
CREATE INDEX IF NOT EXISTS crm_company_promotion_events_company_idx
  ON crm_company_promotion_events (crm_company_id, promoted_at DESC);
CREATE INDEX IF NOT EXISTS crm_contacts_crm_company_idx
  ON crm_contacts (crm_company_id, created_at DESC)
  WHERE crm_company_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS crm_contact_verifications_company_idx
  ON crm_contact_verifications (crm_company_id, verified_at DESC);
CREATE INDEX IF NOT EXISTS crm_contact_verifications_contact_idx
  ON crm_contact_verifications (contact_id, verified_at DESC)
  WHERE contact_id IS NOT NULL;

ALTER TABLE crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_company_promotion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contact_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crm_companies_super_admin_select" ON crm_companies;
CREATE POLICY "crm_companies_super_admin_select"
  ON crm_companies FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "crm_companies_own_client_select" ON crm_companies;
CREATE POLICY "crm_companies_own_client_select"
  ON crm_companies FOR SELECT
  USING (client_id = current_user_client_id());

DROP POLICY IF EXISTS "crm_company_promotion_events_super_admin_select"
  ON crm_company_promotion_events;
CREATE POLICY "crm_company_promotion_events_super_admin_select"
  ON crm_company_promotion_events FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "crm_company_promotion_events_own_client_select"
  ON crm_company_promotion_events;
CREATE POLICY "crm_company_promotion_events_own_client_select"
  ON crm_company_promotion_events FOR SELECT
  USING (client_id = current_user_client_id());

DROP POLICY IF EXISTS "crm_contact_verifications_super_admin_select"
  ON crm_contact_verifications;
CREATE POLICY "crm_contact_verifications_super_admin_select"
  ON crm_contact_verifications FOR SELECT
  USING (current_user_role() = 'super_admin');
DROP POLICY IF EXISTS "crm_contact_verifications_own_client_select"
  ON crm_contact_verifications;
CREATE POLICY "crm_contact_verifications_own_client_select"
  ON crm_contact_verifications FOR SELECT
  USING (client_id = current_user_client_id());

GRANT SELECT ON
  crm_companies, crm_company_promotion_events, crm_contact_verifications
  TO authenticated, service_role;
REVOKE INSERT, UPDATE, DELETE ON
  crm_companies, crm_company_promotion_events, crm_contact_verifications
  FROM authenticated, service_role;

CREATE OR REPLACE FUNCTION invalidate_changed_crm_contact_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.crm_company_id IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM crm_companies company
       WHERE company.id = NEW.crm_company_id
         AND company.client_id = NEW.client_id
     ) THEN
    RAISE EXCEPTION 'CRM company must belong to the contact tenant'
      USING ERRCODE = '23514';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.verification_status = 'verified'
       AND auth.role() <> 'service_role' THEN
      RAISE EXCEPTION 'verified contacts require the controlled verification workflow'
        USING ERRCODE = '42501';
    END IF;
  ELSIF NEW.verification_status = 'verified'
        AND (
          OLD.verification_status <> 'verified'
          OR NEW.verified_by IS DISTINCT FROM OLD.verified_by
          OR NEW.verified_at IS DISTINCT FROM OLD.verified_at
        )
        AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'verified contacts require the controlled verification workflow'
      USING ERRCODE = '42501';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.verification_status = 'verified'
       AND (
         NEW.first_name IS DISTINCT FROM OLD.first_name
         OR NEW.last_name IS DISTINCT FROM OLD.last_name
         OR NEW.email IS DISTINCT FROM OLD.email
         OR NEW.phone IS DISTINCT FROM OLD.phone
         OR NEW.company IS DISTINCT FROM OLD.company
         OR NEW.job_title IS DISTINCT FROM OLD.job_title
         OR NEW.crm_company_id IS DISTINCT FROM OLD.crm_company_id
       ) THEN
      NEW.verification_status := 'unverified';
      NEW.verified_by := NULL;
      NEW.verified_at := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS crm_contacts_invalidate_changed_verification ON crm_contacts;
CREATE TRIGGER crm_contacts_invalidate_changed_verification
BEFORE INSERT OR UPDATE ON crm_contacts
FOR EACH ROW EXECUTE FUNCTION invalidate_changed_crm_contact_verification();

REVOKE ALL ON FUNCTION invalidate_changed_crm_contact_verification()
  FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION promote_lead_company_to_crm(
  p_actor_id UUID,
  p_client_id UUID,
  p_job_ad_id UUID,
  p_company_id UUID
)
RETURNS SETOF crm_companies
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_job job_ads%ROWTYPE;
  v_company lead_companies%ROWTYPE;
  v_score lead_scores%ROWTYPE;
  v_existing crm_companies%ROWTYPE;
  v_saved crm_companies%ROWTYPE;
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

  SELECT * INTO v_job
  FROM job_ads
  WHERE id = p_job_ad_id AND client_id = p_client_id
  FOR SHARE;
  IF NOT FOUND
     OR v_job.status <> 'approved'
     OR v_job.company_id IS DISTINCT FROM p_company_id THEN
    RAISE EXCEPTION 'approved linked job advertisement required' USING ERRCODE = 'P0002';
  END IF;

  SELECT * INTO v_company
  FROM lead_companies
  WHERE id = p_company_id AND client_id = p_client_id
  FOR UPDATE;
  IF NOT FOUND
     OR v_company.status <> 'approved'
     OR v_company.reviewed_by IS NULL
     OR v_company.reviewed_at IS NULL THEN
    RAISE EXCEPTION 'approved reviewed company required' USING ERRCODE = 'P0002';
  END IF;

  IF v_job.lead_score_id IS NOT NULL THEN
    SELECT * INTO v_score
    FROM lead_scores
    WHERE id = v_job.lead_score_id
      AND client_id = p_client_id
      AND job_ad_id = v_job.id
      AND company_id = v_company.id
      AND job_extraction_hash = v_job.extraction_hash
      AND company_enrichment_hash = v_company.enrichment_hash
      AND EXISTS (
        SELECT 1
        FROM lead_scoring_profiles profile
        WHERE profile.id = lead_scores.scoring_profile_id
          AND profile.client_id = p_client_id
          AND profile.version = lead_scores.profile_version
      );
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_client_id::TEXT || ':crm-company:' || v_company.id::TEXT, 0)
  );

  SELECT * INTO v_existing
  FROM crm_companies
  WHERE client_id = p_client_id AND lead_company_id = v_company.id
  FOR UPDATE;
  IF FOUND THEN
    RETURN NEXT v_existing;
    RETURN;
  END IF;

  INSERT INTO crm_companies (
    client_id, lead_company_id, source_job_ad_id, source_lead_score_id,
    source_enrichment_hash, name, domain, website_url, industry, location,
    services, description, source_score_total, source_score_band,
    source_score_summary, status, promoted_by
  )
  VALUES (
    p_client_id,
    v_company.id,
    v_job.id,
    v_score.id,
    v_company.enrichment_hash,
    COALESCE(NULLIF(v_company.name, ''), v_company.domain),
    v_company.domain,
    v_company.website_url,
    v_company.industry,
    v_company.location,
    v_company.services,
    v_company.description,
    v_score.total_score,
    v_score.score_band,
    v_score.summary,
    'prospect',
    p_actor_id
  )
  RETURNING * INTO v_saved;

  INSERT INTO crm_company_promotion_events (
    client_id, lead_company_id, crm_company_id, job_ad_id, lead_score_id,
    enrichment_hash, promoted_by
  )
  VALUES (
    p_client_id, v_company.id, v_saved.id, v_job.id, v_score.id,
    v_company.enrichment_hash, p_actor_id
  );

  RETURN NEXT v_saved;
END;
$$;

REVOKE ALL ON FUNCTION promote_lead_company_to_crm(UUID, UUID, UUID, UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION promote_lead_company_to_crm(UUID, UUID, UUID, UUID)
  TO service_role;

CREATE OR REPLACE FUNCTION add_verified_crm_contact(
  p_actor_id UUID,
  p_client_id UUID,
  p_crm_company_id UUID,
  p_payload JSONB
)
RETURNS SETOF crm_contacts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_company crm_companies%ROWTYPE;
  v_existing crm_contacts%ROWTYPE;
  v_saved crm_contacts%ROWTYPE;
  v_first_name TEXT := btrim(COALESCE(p_payload->>'first_name', ''));
  v_last_name TEXT := NULLIF(btrim(COALESCE(p_payload->>'last_name', '')), '');
  v_email TEXT := NULLIF(lower(btrim(COALESCE(p_payload->>'email', ''))), '');
  v_phone TEXT := NULLIF(btrim(COALESCE(p_payload->>'phone', '')), '');
  v_job_title TEXT := NULLIF(btrim(COALESCE(p_payload->>'job_title', '')), '');
  v_method TEXT := p_payload->>'verification_method';
  v_source_url TEXT := p_payload->>'source_url';
  v_evidence_note TEXT := btrim(COALESCE(p_payload->>'evidence_note', ''));
  v_identity_key TEXT;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;
  IF p_payload IS NULL
     OR jsonb_typeof(p_payload) <> 'object'
     OR length(v_first_name) NOT BETWEEN 1 AND 100
     OR (v_last_name IS NOT NULL AND length(v_last_name) > 100)
     OR (v_email IS NULL AND v_phone IS NULL)
     OR (v_email IS NOT NULL AND (
       length(v_email) > 255
       OR v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
     ))
     OR (v_phone IS NOT NULL AND length(v_phone) > 50)
     OR (v_job_title IS NOT NULL AND length(v_job_title) > 200)
     OR v_method IS NULL
     OR v_method NOT IN (
       'company_website', 'linkedin', 'email', 'phone', 'manual_research'
     )
     OR v_source_url IS NULL
     OR v_source_url !~ '^https://'
     OR length(v_source_url) > 2048
     OR length(v_evidence_note) NOT BETWEEN 1 AND 2000 THEN
    RAISE EXCEPTION 'invalid verified contact payload' USING ERRCODE = '22023';
  END IF;

  SELECT role, client_id INTO v_actor_role, v_actor_client_id
  FROM users WHERE id = p_actor_id;
  IF v_actor_role IS NULL
     OR v_actor_role NOT IN ('super_admin', 'client_admin')
     OR (v_actor_role <> 'super_admin' AND v_actor_client_id IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_company
  FROM crm_companies
  WHERE id = p_crm_company_id AND client_id = p_client_id
  FOR SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'promoted CRM company not found' USING ERRCODE = 'P0002';
  END IF;

  v_identity_key := COALESCE('email:' || v_email, 'phone:' || v_phone);
  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_client_id::TEXT || ':crm-contact:' || v_identity_key, 0)
  );

  SELECT * INTO v_existing
  FROM crm_contacts
  WHERE client_id = p_client_id
    AND (
      (v_email IS NOT NULL AND lower(email) = v_email)
      OR (v_phone IS NOT NULL AND phone = v_phone)
    )
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE;
  IF FOUND THEN
    IF v_existing.crm_company_id = v_company.id
       AND v_existing.verification_status = 'verified' THEN
      RETURN NEXT v_existing;
      RETURN;
    END IF;
    RAISE EXCEPTION 'contact email or phone already exists' USING ERRCODE = '23505';
  END IF;

  INSERT INTO crm_contacts (
    client_id, first_name, last_name, email, phone, company, job_title,
    status, source, tags, notes, created_by, crm_company_id,
    verification_status, verified_by, verified_at
  )
  VALUES (
    p_client_id, v_first_name, v_last_name, v_email, v_phone, v_company.name,
    v_job_title, 'lead', 'verified_job_lead',
    ARRAY['job-lead', 'verified-contact']::TEXT[], NULL, p_actor_id,
    v_company.id, 'verified', p_actor_id, now()
  )
  RETURNING * INTO v_saved;

  INSERT INTO crm_contact_verifications (
    client_id, contact_id, crm_company_id, verification_method, source_url,
    evidence_note, verified_name, verified_email, verified_phone,
    verified_job_title, verified_by
  )
  VALUES (
    p_client_id, v_saved.id, v_company.id, v_method, v_source_url,
    v_evidence_note, concat_ws(' ', v_first_name, v_last_name),
    v_email, v_phone, v_job_title, p_actor_id
  );

  RETURN NEXT v_saved;
END;
$$;

REVOKE ALL ON FUNCTION add_verified_crm_contact(UUID, UUID, UUID, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION add_verified_crm_contact(UUID, UUID, UUID, JSONB)
  TO service_role;

COMMENT ON TABLE crm_companies IS
  'Explicitly promoted company records. Job and enrichment pipelines never insert here automatically.';
COMMENT ON TABLE crm_contact_verifications IS
  'Immutable source evidence for real people explicitly added to CRM after verification.';

SELECT json_build_object(
  'migration_complete',
    to_regclass('public.crm_companies') IS NOT NULL
    AND to_regclass('public.crm_company_promotion_events') IS NOT NULL
    AND to_regclass('public.crm_contact_verifications') IS NOT NULL
    AND to_regprocedure(
      'public.promote_lead_company_to_crm(uuid,uuid,uuid,uuid)'
    ) IS NOT NULL
    AND to_regprocedure(
      'public.add_verified_crm_contact(uuid,uuid,uuid,jsonb)'
    ) IS NOT NULL,
  'installed_tables', ARRAY[
    'crm_companies',
    'crm_company_promotion_events',
    'crm_contact_verifications'
  ],
  'installed_functions', ARRAY[
    'invalidate_changed_crm_contact_verification',
    'promote_lead_company_to_crm',
    'add_verified_crm_contact'
  ],
  'crm_rule', 'explicit_company_promotion_and_verified_people_only'
) AS rapidtal_phase_5_result;
