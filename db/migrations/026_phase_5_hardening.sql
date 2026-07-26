-- ============================================================
-- 026_phase_5_hardening.sql
-- Phase 5 hardening: atomic CRM identity uniqueness and safe
-- verification of an existing real contact.
-- Run after 025_review_and_crm_promotion.sql.
-- ============================================================

DO $$
DECLARE
  v_duplicate_email TEXT;
  v_duplicate_phone TEXT;
BEGIN
  SELECT lower(btrim(email))
  INTO v_duplicate_email
  FROM crm_contacts
  WHERE NULLIF(btrim(email), '') IS NOT NULL
  GROUP BY client_id, lower(btrim(email))
  HAVING count(*) > 1
  LIMIT 1;

  IF v_duplicate_email IS NOT NULL THEN
    RAISE EXCEPTION
      'Migration 026 stopped: duplicate CRM email identities exist (example: %). Merge or correct duplicates, then rerun.',
      v_duplicate_email
      USING ERRCODE = '23505';
  END IF;

  SELECT regexp_replace(phone, '[^0-9]', '', 'g')
  INTO v_duplicate_phone
  FROM crm_contacts
  WHERE NULLIF(regexp_replace(phone, '[^0-9]', '', 'g'), '') IS NOT NULL
  GROUP BY client_id, regexp_replace(phone, '[^0-9]', '', 'g')
  HAVING count(*) > 1
  LIMIT 1;

  IF v_duplicate_phone IS NOT NULL THEN
    RAISE EXCEPTION
      'Migration 026 stopped: duplicate CRM phone identities exist (example normalized number: %). Merge or correct duplicates, then rerun.',
      v_duplicate_phone
      USING ERRCODE = '23505';
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS crm_contacts_client_email_unique_idx
  ON crm_contacts (client_id, lower(btrim(email)))
  WHERE NULLIF(btrim(email), '') IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS crm_contacts_client_phone_unique_idx
  ON crm_contacts (client_id, regexp_replace(phone, '[^0-9]', '', 'g'))
  WHERE NULLIF(regexp_replace(phone, '[^0-9]', '', 'g'), '') IS NOT NULL;

ALTER TABLE crm_contact_verifications
  DROP CONSTRAINT IF EXISTS crm_contact_verifications_source_url_safe;
ALTER TABLE crm_contact_verifications
  ADD CONSTRAINT crm_contact_verifications_source_url_safe CHECK (
    source_url ~ '^https://[^/[:space:]@]+([/?#]|$)'
    AND source_url !~ '^https://[^/]*@'
    AND length(source_url) <= 2048
  );

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
  v_phone_identity TEXT;
  v_job_title TEXT := NULLIF(btrim(COALESCE(p_payload->>'job_title', '')), '');
  v_method TEXT := p_payload->>'verification_method';
  v_source_url TEXT := btrim(COALESCE(p_payload->>'source_url', ''));
  v_evidence_note TEXT := btrim(COALESCE(p_payload->>'evidence_note', ''));
  v_expected_name TEXT;
  v_existing_name TEXT;
  v_lock_keys BIGINT[] := '{}';
  v_lock_key BIGINT;
BEGIN
  IF auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'service role required' USING ERRCODE = '42501';
  END IF;

  v_phone_identity := NULLIF(regexp_replace(v_phone, '[^0-9]', '', 'g'), '');

  IF p_payload IS NULL
     OR jsonb_typeof(p_payload) <> 'object'
     OR length(v_first_name) NOT BETWEEN 1 AND 100
     OR (v_last_name IS NOT NULL AND length(v_last_name) > 100)
     OR (v_email IS NULL AND v_phone_identity IS NULL)
     OR (v_email IS NOT NULL AND (
       length(v_email) > 255
       OR v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
     ))
     OR (v_phone IS NOT NULL AND (
       length(v_phone) > 50
       OR length(v_phone_identity) NOT BETWEEN 7 AND 20
     ))
     OR (v_job_title IS NOT NULL AND length(v_job_title) > 200)
     OR v_method IS NULL
     OR v_method NOT IN (
       'company_website', 'linkedin', 'email', 'phone', 'manual_research'
     )
     OR v_source_url !~ '^https://[^/[:space:]@]+([/?#]|$)'
     OR v_source_url ~ '^https://[^/]*@'
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

  -- Lock every supplied identity, in numeric order, so email/phone crossover
  -- requests cannot race or deadlock. Unique indexes remain the final guard.
  IF v_email IS NOT NULL THEN
    v_lock_keys := array_append(
      v_lock_keys,
      hashtextextended(p_client_id::TEXT || ':crm-contact:email:' || v_email, 0)
    );
  END IF;
  IF v_phone_identity IS NOT NULL THEN
    v_lock_keys := array_append(
      v_lock_keys,
      hashtextextended(
        p_client_id::TEXT || ':crm-contact:phone:' || v_phone_identity,
        0
      )
    );
  END IF;
  FOR v_lock_key IN
    SELECT key_value
    FROM unnest(v_lock_keys) AS key_value
    ORDER BY key_value
  LOOP
    PERFORM pg_advisory_xact_lock(v_lock_key);
  END LOOP;

  SELECT * INTO v_existing
  FROM crm_contacts
  WHERE client_id = p_client_id
    AND (
      (v_email IS NOT NULL AND lower(btrim(email)) = v_email)
      OR (
        v_phone_identity IS NOT NULL
        AND regexp_replace(phone, '[^0-9]', '', 'g') = v_phone_identity
      )
    )
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE;

  v_expected_name := lower(btrim(concat_ws(' ', v_first_name, v_last_name)));

  IF FOUND THEN
    v_existing_name := lower(
      btrim(concat_ws(' ', v_existing.first_name, v_existing.last_name))
    );

    IF v_existing.crm_company_id = v_company.id
       AND v_existing.verification_status = 'verified'
       AND (
         v_email IS NULL
         OR lower(btrim(v_existing.email)) = v_email
       )
       AND (
         v_phone_identity IS NULL
         OR regexp_replace(v_existing.phone, '[^0-9]', '', 'g') = v_phone_identity
       ) THEN
      RETURN NEXT v_existing;
      RETURN;
    END IF;

    IF v_existing.verification_status = 'unverified'
       AND v_existing_name = v_expected_name
       AND (
         v_existing.crm_company_id IS NULL
         OR v_existing.crm_company_id = v_company.id
       ) THEN
      UPDATE crm_contacts
      SET
        email = COALESCE(v_email, email),
        phone = COALESCE(v_phone, phone),
        company = v_company.name,
        job_title = COALESCE(v_job_title, job_title),
        crm_company_id = v_company.id,
        source = COALESCE(NULLIF(source, ''), 'verified_job_lead'),
        tags = ARRAY(
          SELECT DISTINCT tag
          FROM unnest(
            COALESCE(tags, '{}') || ARRAY['job-lead', 'verified-contact']::TEXT[]
          ) AS tag
        ),
        verification_status = 'verified',
        verified_by = p_actor_id,
        verified_at = now(),
        updated_at = now()
      WHERE id = v_existing.id
      RETURNING * INTO v_saved;
    ELSE
      RAISE EXCEPTION 'contact email or phone already exists'
        USING ERRCODE = '23505';
    END IF;
  ELSE
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
  END IF;

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

SELECT json_build_object(
  'migration_complete',
    to_regclass('public.crm_contacts_client_email_unique_idx') IS NOT NULL
    AND to_regclass('public.crm_contacts_client_phone_unique_idx') IS NOT NULL
    AND to_regprocedure(
      'public.add_verified_crm_contact(uuid,uuid,uuid,jsonb)'
    ) IS NOT NULL,
  'installed_indexes', ARRAY[
    'crm_contacts_client_email_unique_idx',
    'crm_contacts_client_phone_unique_idx'
  ],
  'installed_functions', ARRAY[
    'add_verified_crm_contact'
  ],
  'hardening', ARRAY[
    'dual_identity_advisory_locks',
    'database_unique_identity_guards',
    'safe_existing_contact_verification',
    'credential_free_evidence_urls'
  ]
) AS rapidtal_phase_5_hardening_result;
