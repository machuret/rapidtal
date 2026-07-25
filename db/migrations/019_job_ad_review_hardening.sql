-- ============================================================
-- 019_job_ad_review_hardening.sql
-- Phase 1 hardening: immutable review hashes, audited transitions,
-- and removal of direct authenticated writes to extracted records.
-- Run after 018_job_ad_ingestion.sql.
-- ============================================================

ALTER TABLE job_ads
  ADD COLUMN IF NOT EXISTS extraction_hash TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_content_hash TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_extraction_hash TEXT;

CREATE TABLE IF NOT EXISTS job_ad_review_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_ad_id       UUID NOT NULL REFERENCES job_ads(id) ON DELETE CASCADE,
  from_status     TEXT NOT NULL,
  to_status       TEXT NOT NULL CHECK (to_status IN ('needs_review', 'approved', 'rejected')),
  notes           TEXT,
  content_hash    TEXT NOT NULL,
  extraction_hash TEXT,
  reviewed_by     UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT job_ad_review_events_notes_length CHECK (notes IS NULL OR length(notes) <= 1000)
);

CREATE INDEX IF NOT EXISTS job_ad_review_events_job_created_idx
  ON job_ad_review_events (job_ad_id, created_at DESC);

CREATE INDEX IF NOT EXISTS job_ad_review_events_client_created_idx
  ON job_ad_review_events (client_id, created_at DESC);

ALTER TABLE job_ad_review_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_ads_own_client_select" ON job_ads;
CREATE POLICY "job_ads_own_client_select"
  ON job_ads FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

DROP POLICY IF EXISTS "job_scrape_runs_own_client_select" ON job_scrape_runs;
CREATE POLICY "job_scrape_runs_own_client_select"
  ON job_scrape_runs FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

DROP POLICY IF EXISTS "job_ad_review_events_super_admin_select" ON job_ad_review_events;
CREATE POLICY "job_ad_review_events_super_admin_select"
  ON job_ad_review_events FOR SELECT
  USING (current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "job_ad_review_events_own_client_select" ON job_ad_review_events;
CREATE POLICY "job_ad_review_events_own_client_select"
  ON job_ad_review_events FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

-- Extracted evidence is service-owned. Reviewers must use review_job_ad,
-- which changes only review state and creates an immutable audit event.
REVOKE UPDATE ON TABLE job_ads FROM authenticated;
DROP POLICY IF EXISTS "job_ads_client_admin_update" ON job_ads;

GRANT SELECT ON TABLE job_ad_review_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE job_ad_review_events TO service_role;

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
SET search_path = public
AS $$
DECLARE
  v_actor_role TEXT;
  v_actor_client_id UUID;
  v_from_status TEXT;
  v_content_hash TEXT;
  v_extraction_hash TEXT;
  v_notes TEXT;
BEGIN
  IF p_status NOT IN ('needs_review', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid review status'
      USING ERRCODE = '22023';
  END IF;

  SELECT role, client_id
    INTO v_actor_role, v_actor_client_id
  FROM public.users
  WHERE id = p_actor_id;

  IF v_actor_role IS NULL
     OR v_actor_role NOT IN ('super_admin', 'client_admin')
     OR (v_actor_role <> 'super_admin' AND v_actor_client_id IS DISTINCT FROM p_client_id) THEN
    RAISE EXCEPTION 'Forbidden'
      USING ERRCODE = '42501';
  END IF;

  SELECT status, raw_content_hash, extraction_hash
    INTO v_from_status, v_content_hash, v_extraction_hash
  FROM public.job_ads
  WHERE id = p_job_ad_id
    AND client_id = p_client_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Job advertisement not found'
      USING ERRCODE = 'P0002';
  END IF;

  v_notes := NULLIF(left(btrim(COALESCE(p_notes, '')), 1000), '');

  UPDATE public.job_ads
  SET
    status = p_status,
    reviewed_by = CASE WHEN p_status = 'needs_review' THEN NULL ELSE p_actor_id END,
    reviewed_at = CASE WHEN p_status = 'needs_review' THEN NULL ELSE now() END,
    reviewed_content_hash = CASE WHEN p_status = 'needs_review' THEN NULL ELSE v_content_hash END,
    reviewed_extraction_hash = CASE WHEN p_status = 'needs_review' THEN NULL ELSE v_extraction_hash END,
    updated_at = now()
  WHERE id = p_job_ad_id
    AND client_id = p_client_id;

  INSERT INTO public.job_ad_review_events (
    client_id,
    job_ad_id,
    from_status,
    to_status,
    notes,
    content_hash,
    extraction_hash,
    reviewed_by
  )
  VALUES (
    p_client_id,
    p_job_ad_id,
    v_from_status,
    p_status,
    v_notes,
    v_content_hash,
    v_extraction_hash,
    p_actor_id
  );

  RETURN QUERY
  SELECT job.*
  FROM public.job_ads AS job
  WHERE job.id = p_job_ad_id
    AND job.client_id = p_client_id;
END;
$$;

REVOKE ALL ON FUNCTION review_job_ad(UUID, UUID, UUID, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION review_job_ad(UUID, UUID, UUID, TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION review_job_ad(UUID, UUID, UUID, TEXT, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION review_job_ad(UUID, UUID, UUID, TEXT, TEXT) TO service_role;
