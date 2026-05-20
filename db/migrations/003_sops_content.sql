-- ============================================================
-- 003_sops_content.sql – SOPs + Content Creation
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS sops (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  category    TEXT DEFAULT 'General',
  body        TEXT NOT NULL DEFAULT '',
  order_index INT DEFAULT 0,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sops_client_id_idx ON sops(client_id);

CREATE TABLE IF NOT EXISTS content_pieces (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('email','social','newsletter','blog')),
  title        TEXT NOT NULL,
  brief        TEXT,
  body         TEXT,
  status       TEXT DEFAULT 'draft' CHECK (status IN ('draft','approved','archived')),
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS content_pieces_client_id_idx ON content_pieces(client_id);

-- RLS
ALTER TABLE sops            ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pieces  ENABLE ROW LEVEL SECURITY;

-- SOPs
CREATE POLICY "sops_super_admin_all"
  ON sops FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "sops_own_client_select"
  ON sops FOR SELECT
  USING (client_id = current_user_client_id());

CREATE POLICY "sops_client_admin_write"
  ON sops FOR ALL
  USING (current_user_role() = 'client_admin' AND client_id = current_user_client_id())
  WITH CHECK (current_user_role() = 'client_admin' AND client_id = current_user_client_id());

-- Content pieces
CREATE POLICY "content_super_admin_all"
  ON content_pieces FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "content_own_client_all"
  ON content_pieces FOR ALL
  USING (client_id = current_user_client_id())
  WITH CHECK (client_id = current_user_client_id());
