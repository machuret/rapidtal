-- ============================================================
-- 007_time_entries.sql – VA Time Tracking (DB-persisted)
-- Run in Supabase SQL Editor after 006_user_profile.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS time_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  work_date   DATE NOT NULL,
  phase       TEXT NOT NULL CHECK (phase IN ('work', 'break')),
  started_at  TIMESTAMPTZ NOT NULL,
  ended_at    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS time_entries_user_date_idx   ON time_entries(user_id, work_date DESC);
CREATE INDEX IF NOT EXISTS time_entries_client_date_idx ON time_entries(client_id, work_date DESC);

-- RLS
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- VA: full access to own entries
CREATE POLICY "te_own_all"
  ON time_entries FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND client_id = current_user_client_id());

-- client_admin: read all entries for their client
CREATE POLICY "te_admin_select"
  ON time_entries FOR SELECT
  USING (
    client_id = current_user_client_id()
    AND current_user_role() IN ('client_admin', 'super_admin')
  );

-- super_admin: full access
CREATE POLICY "te_super_admin_all"
  ON time_entries FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');
