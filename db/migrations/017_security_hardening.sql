-- ============================================================
-- 017_security_hardening.sql
-- Security fixes for CRM aggregation, notes, and API rate limits.
-- Run after 016_missing_indexes.sql.
-- ============================================================

-- SECURITY DEFINER bypasses RLS, so enforce tenant access inside the function.
CREATE OR REPLACE FUNCTION get_contact_status_counts(p_client_id UUID)
RETURNS TABLE(status TEXT, count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT contact.status::TEXT, COUNT(*)::BIGINT
  FROM crm_contacts AS contact
  WHERE contact.client_id = p_client_id
    AND (
      p_client_id = current_user_client_id()
      OR current_user_role() = 'super_admin'
      OR auth.role() = 'service_role'
    )
  GROUP BY contact.status;
$$;

REVOKE ALL ON FUNCTION get_contact_status_counts(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_contact_status_counts(UUID) TO authenticated;

-- A VA may read tenant notes, create notes as themselves, and delete only their
-- own notes. Client and super admins retain their broader policies.
DROP POLICY IF EXISTS "crm_notes_own_client_all" ON crm_notes;
DROP POLICY IF EXISTS "crm_notes_own_client_select" ON crm_notes;
DROP POLICY IF EXISTS "crm_notes_own_client_insert" ON crm_notes;
DROP POLICY IF EXISTS "crm_notes_author_or_admin_delete" ON crm_notes;

CREATE POLICY "crm_notes_own_client_select"
  ON crm_notes FOR SELECT
  USING (client_id = current_user_client_id());

CREATE POLICY "crm_notes_own_client_insert"
  ON crm_notes FOR INSERT
  WITH CHECK (
    client_id = current_user_client_id()
    AND created_by = auth.uid()
  );

CREATE POLICY "crm_notes_author_or_admin_delete"
  ON crm_notes FOR DELETE
  USING (
    client_id = current_user_client_id()
    AND (
      created_by = auth.uid()
      OR current_user_role() = 'client_admin'
    )
  );

-- Supports case-insensitive duplicate checks without changing existing data.
CREATE INDEX IF NOT EXISTS crm_contacts_client_email_lower_idx
  ON crm_contacts (client_id, lower(email))
  WHERE email IS NOT NULL;

-- Shared, atomic rate-limit state for server routes and Edge Functions.
CREATE TABLE IF NOT EXISTS api_rate_limits (
  rate_limit_key   TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_count     INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE api_rate_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE api_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION consume_api_rate_limit(
  p_key TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := clock_timestamp();
  v_count INTEGER;
BEGIN
  IF p_key IS NULL
     OR btrim(p_key) = ''
     OR p_limit < 1
     OR p_window_seconds < 1 THEN
    RETURN FALSE;
  END IF;

  INSERT INTO api_rate_limits (
    rate_limit_key,
    window_started_at,
    request_count,
    updated_at
  )
  VALUES (p_key, v_now, 1, v_now)
  ON CONFLICT (rate_limit_key) DO UPDATE
  SET
    window_started_at = CASE
      WHEN api_rate_limits.window_started_at
           <= v_now - make_interval(secs => p_window_seconds)
        THEN v_now
      ELSE api_rate_limits.window_started_at
    END,
    request_count = CASE
      WHEN api_rate_limits.window_started_at
           <= v_now - make_interval(secs => p_window_seconds)
        THEN 1
      ELSE api_rate_limits.request_count + 1
    END,
    updated_at = v_now
  RETURNING request_count INTO v_count;

  RETURN v_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION consume_api_rate_limit(TEXT, INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION consume_api_rate_limit(TEXT, INTEGER, INTEGER)
  TO service_role;
