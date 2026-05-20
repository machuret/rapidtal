-- ============================================================
-- 004_daily_log.sql – Daily Log / VA Work Journal
-- Run in Supabase SQL Editor after 003_sops_content.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date         DATE NOT NULL,
  tasks_done       TEXT DEFAULT '',
  positives        TEXT DEFAULT '',
  challenges       TEXT DEFAULT '',
  goals_achieved   TEXT DEFAULT '',
  goals_tomorrow   TEXT DEFAULT '',
  mood             TEXT CHECK (mood IN ('great','good','neutral','difficult','overwhelmed')),
  admin_feedback   TEXT,
  reviewed_at      TIMESTAMPTZ,
  reviewed_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, log_date)
);
CREATE INDEX IF NOT EXISTS daily_logs_client_id_idx ON daily_logs(client_id);
CREATE INDEX IF NOT EXISTS daily_logs_user_id_idx   ON daily_logs(user_id);
CREATE INDEX IF NOT EXISTS daily_logs_date_idx      ON daily_logs(log_date DESC);

CREATE TABLE IF NOT EXISTS daily_log_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id     UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS daily_log_notes_log_id_idx ON daily_log_notes(log_id);

-- RLS
ALTER TABLE daily_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_log_notes  ENABLE ROW LEVEL SECURITY;

-- daily_logs: VA reads/writes own rows
CREATE POLICY "dlogs_own_select"
  ON daily_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "dlogs_own_insert"
  ON daily_logs FOR INSERT
  WITH CHECK (user_id = auth.uid() AND client_id = current_user_client_id());

CREATE POLICY "dlogs_own_update"
  ON daily_logs FOR UPDATE
  USING (user_id = auth.uid());

-- daily_logs: client_admin reads all logs for their client + can update admin_feedback
CREATE POLICY "dlogs_admin_select"
  ON daily_logs FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() IN ('client_admin', 'super_admin')
  );

CREATE POLICY "dlogs_admin_update"
  ON daily_logs FOR UPDATE
  USING (
    client_id = current_user_client_id()
    AND current_user_role() IN ('client_admin', 'super_admin')
  );

-- super_admin full access
CREATE POLICY "dlogs_super_admin_all"
  ON daily_logs FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

-- daily_log_notes: VA reads/writes own notes
CREATE POLICY "dlognotes_own_select"
  ON daily_log_notes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "dlognotes_own_insert"
  ON daily_log_notes FOR INSERT
  WITH CHECK (user_id = auth.uid() AND client_id = current_user_client_id());

CREATE POLICY "dlognotes_own_delete"
  ON daily_log_notes FOR DELETE
  USING (user_id = auth.uid());

-- daily_log_notes: client_admin reads all for their client
CREATE POLICY "dlognotes_admin_select"
  ON daily_log_notes FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() IN ('client_admin', 'super_admin')
  );
