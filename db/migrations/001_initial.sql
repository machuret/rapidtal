-- ============================================================
-- 001_initial.sql  – Rapid Tile Portal schema
-- Run in Supabase SQL Editor
-- ============================================================

-- Clients (tenants)
CREATE TABLE IF NOT EXISTS clients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  created_by  UUID
);

-- Users (extends auth.users 1:1)
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL CHECK (role IN ('super_admin','client_admin','va')),
  client_id   UUID REFERENCES clients(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Add FK from clients.created_by -> users.id (deferred to avoid chicken-egg)
ALTER TABLE clients
  ADD CONSTRAINT clients_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- Company DNA (1:1 per client)
CREATE TABLE IF NOT EXISTS company_dna (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id          UUID UNIQUE NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_name       TEXT,
  founders           TEXT,
  location           TEXT,
  phone              TEXT,
  email              TEXT,
  website            TEXT,
  values             TEXT,
  services           TEXT,
  target_demographic TEXT,
  client_type        TEXT,
  extra              JSONB DEFAULT '{}'::jsonb,
  updated_at         TIMESTAMPTZ DEFAULT now()
);

-- Vault items
CREATE TABLE IF NOT EXISTS vault_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id      UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  source_type    TEXT NOT NULL CHECK (source_type IN ('pdf','docx','text','url')),
  title          TEXT NOT NULL,
  source_url     TEXT,
  storage_path   TEXT,
  raw_content    TEXT,
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','ready','error')),
  error_message  TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  created_by     UUID REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS vault_items_client_id_idx ON vault_items(client_id);

-- KB entries
CREATE TABLE IF NOT EXISTS kb_entries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  question         TEXT NOT NULL,
  answer           TEXT NOT NULL,
  source_vault_ids UUID[] DEFAULT '{}',
  generated_at     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kb_entries_client_id_idx ON kb_entries(client_id);

-- KB generation run history
CREATE TABLE IF NOT EXISTS kb_generation_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  triggered_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  status            TEXT DEFAULT 'running' CHECK (status IN ('running','completed','failed')),
  entries_generated INT,
  tokens_used       INT,
  error_message     TEXT,
  started_at        TIMESTAMPTZ DEFAULT now(),
  completed_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS kb_runs_client_id_idx ON kb_generation_runs(client_id);

-- ============================================================
-- Row-Level Security
-- ============================================================

ALTER TABLE clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_dna      ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_entries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_generation_runs ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT LANGUAGE sql STABLE AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$;

-- Helper: get current user's client_id
CREATE OR REPLACE FUNCTION current_user_client_id()
RETURNS UUID LANGUAGE sql STABLE AS $$
  SELECT client_id FROM users WHERE id = auth.uid()
$$;

-- CLIENTS
CREATE POLICY "clients_super_admin_all"
  ON clients FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "clients_own_client_select"
  ON clients FOR SELECT
  USING (id = current_user_client_id());

-- USERS
CREATE POLICY "users_super_admin_all"
  ON users FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "users_own_client_select"
  ON users FOR SELECT
  USING (client_id = current_user_client_id() OR id = auth.uid());

CREATE POLICY "users_client_admin_manage"
  ON users FOR INSERT
  WITH CHECK (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

-- COMPANY DNA
CREATE POLICY "dna_super_admin_all"
  ON company_dna FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "dna_own_client_select"
  ON company_dna FOR SELECT
  USING (client_id = current_user_client_id());

CREATE POLICY "dna_client_admin_write"
  ON company_dna FOR INSERT
  WITH CHECK (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

CREATE POLICY "dna_client_admin_update"
  ON company_dna FOR UPDATE
  USING (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

-- VAULT ITEMS
CREATE POLICY "vault_super_admin_all"
  ON vault_items FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "vault_own_client_select"
  ON vault_items FOR SELECT
  USING (client_id = current_user_client_id());

CREATE POLICY "vault_client_admin_write"
  ON vault_items FOR INSERT
  WITH CHECK (
    current_user_role() IN ('client_admin')
    AND client_id = current_user_client_id()
  );

CREATE POLICY "vault_client_admin_update"
  ON vault_items FOR UPDATE
  USING (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

CREATE POLICY "vault_client_admin_delete"
  ON vault_items FOR DELETE
  USING (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

-- KB ENTRIES
CREATE POLICY "kb_super_admin_all"
  ON kb_entries FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "kb_own_client_select"
  ON kb_entries FOR SELECT
  USING (client_id = current_user_client_id());

CREATE POLICY "kb_client_admin_write"
  ON kb_entries FOR INSERT
  WITH CHECK (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

CREATE POLICY "kb_client_admin_delete"
  ON kb_entries FOR DELETE
  USING (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

-- KB GENERATION RUNS
CREATE POLICY "kbrun_super_admin_all"
  ON kb_generation_runs FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

CREATE POLICY "kbrun_own_client_select"
  ON kb_generation_runs FOR SELECT
  USING (client_id = current_user_client_id());

CREATE POLICY "kbrun_client_admin_insert"
  ON kb_generation_runs FOR INSERT
  WITH CHECK (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

CREATE POLICY "kbrun_client_admin_update"
  ON kb_generation_runs FOR UPDATE
  USING (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );
