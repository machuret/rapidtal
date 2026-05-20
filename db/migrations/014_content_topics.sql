-- ============================================================
-- 014_content_topics.sql – Content Topics approval workflow
-- Run in Supabase SQL Editor after 013_fix_rls_recursion.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS content_topics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  content_type TEXT NOT NULL DEFAULT 'blog' CHECK (content_type IN ('email','social','newsletter','blog')),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_topics_client_id_idx ON content_topics(client_id);
CREATE INDEX IF NOT EXISTS content_topics_status_idx    ON content_topics(status);

ALTER TABLE content_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_topics_super_admin_all"
  ON content_topics FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "content_topics_own_client_select"
  ON content_topics FOR SELECT
  USING (client_id = current_user_client_id());

CREATE POLICY "content_topics_own_client_insert"
  ON content_topics FOR INSERT
  WITH CHECK (client_id = current_user_client_id());

CREATE POLICY "content_topics_client_admin_update"
  ON content_topics FOR UPDATE
  USING (current_user_role() = 'client_admin' AND client_id = current_user_client_id())
  WITH CHECK (current_user_role() = 'client_admin' AND client_id = current_user_client_id());

CREATE POLICY "content_topics_client_admin_delete"
  ON content_topics FOR DELETE
  USING (current_user_role() = 'client_admin' AND client_id = current_user_client_id());

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER content_topics_updated_at
  BEFORE UPDATE ON content_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
