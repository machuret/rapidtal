-- ============================================================
-- 002_crm.sql – CRM contacts + notes
-- Run in Supabase SQL Editor after 001_initial.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS crm_contacts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  first_name   TEXT NOT NULL,
  last_name    TEXT,
  email        TEXT,
  phone        TEXT,
  company      TEXT,
  job_title    TEXT,
  status       TEXT DEFAULT 'lead' CHECK (status IN ('lead','prospect','active','inactive','closed')),
  source       TEXT,
  tags         TEXT[] DEFAULT '{}',
  notes        TEXT,
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_contacts_client_id_idx ON crm_contacts(client_id);

CREATE TABLE IF NOT EXISTS crm_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id   UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  client_id    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  body         TEXT NOT NULL,
  created_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS crm_notes_contact_id_idx ON crm_notes(contact_id);

-- RLS
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crm_contacts_super_admin_all"
  ON crm_contacts FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "crm_contacts_own_client_all"
  ON crm_contacts FOR ALL
  USING (client_id = current_user_client_id())
  WITH CHECK (client_id = current_user_client_id());

CREATE POLICY "crm_notes_super_admin_all"
  ON crm_notes FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "crm_notes_own_client_all"
  ON crm_notes FOR ALL
  USING (client_id = current_user_client_id())
  WITH CHECK (client_id = current_user_client_id());
