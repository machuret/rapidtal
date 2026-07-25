-- ============================================================
-- RapidTal combined migration: 003 through 018
-- Generated from the canonical files in db/migrations.
--
-- Prerequisite: 001_initial.sql and 002_crm.sql must already
-- have completed successfully.
--
-- This script is transactional. If any statement fails, PostgreSQL
-- rolls back the whole 003-018 installation.
-- The legacy public.leads table is not altered.
-- ============================================================

BEGIN;

DO $rapidtal_preflight$
BEGIN
  IF to_regclass('public.clients') IS NULL
     OR to_regclass('public.users') IS NULL
     OR to_regclass('public.crm_contacts') IS NULL
     OR to_regclass('public.crm_notes') IS NULL THEN
    RAISE EXCEPTION
      'RapidTal prerequisites are missing. Run 001_initial.sql and 002_crm.sql first.';
  END IF;
END
$rapidtal_preflight$;

-- ============================================================
-- BEGIN 003_sops_content.sql
-- ============================================================

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

-- END 003_sops_content.sql

-- ============================================================
-- BEGIN 004_daily_log.sql
-- ============================================================

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

-- END 004_daily_log.sql

-- ============================================================
-- BEGIN 005_perf.sql
-- ============================================================

-- ============================================================
-- 005_perf.sql – Performance indexes and helper functions
-- Run in Supabase SQL Editor after 004_daily_log.sql
-- ============================================================

-- Composite index covering the most common daily_log query:
-- WHERE user_id = $1 AND log_date = $2
-- Also serves the history strip query (WHERE user_id = $1 ORDER BY log_date DESC)
CREATE INDEX IF NOT EXISTS daily_logs_user_date_idx
  ON daily_logs(user_id, log_date DESC);

-- Composite index for admin review queries:
-- WHERE client_id = $1 ORDER BY log_date DESC
CREATE INDEX IF NOT EXISTS daily_logs_client_date_idx
  ON daily_logs(client_id, log_date DESC);

-- ============================================================
-- Contact status aggregation — replaces JS-side full-table scan
-- ============================================================
CREATE OR REPLACE FUNCTION get_contact_status_counts(p_client_id UUID)
RETURNS TABLE(status TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status::TEXT, COUNT(*)::BIGINT
  FROM crm_contacts
  WHERE client_id = p_client_id
    AND (
      p_client_id = current_user_client_id()
      OR current_user_role() = 'super_admin'
      OR auth.role() = 'service_role'
    )
  GROUP BY status;
$$;

-- SECURITY DEFINER bypasses RLS, so the function itself enforces tenant access.
REVOKE ALL ON FUNCTION get_contact_status_counts(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_contact_status_counts(UUID) TO authenticated;

-- Register the function in the Database type (informational comment)
-- Update types/database.ts Functions section to include this function.

-- END 005_perf.sql

-- ============================================================
-- BEGIN 006_user_profile.sql
-- ============================================================

-- ============================================================
-- 006_user_profile.sql – Extended user profile fields
-- Run in Supabase SQL Editor after 005_perf.sql
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone      TEXT,
  ADD COLUMN IF NOT EXISTS birthday   DATE,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- RLS: users can update their own profile fields
CREATE POLICY "users_update_own_profile" ON users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- END 006_user_profile.sql

-- ============================================================
-- BEGIN 007_time_entries.sql
-- ============================================================

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

-- END 007_time_entries.sql

-- ============================================================
-- BEGIN 008_kb_categories.sql
-- ============================================================

-- ============================================================
-- 008_kb_categories.sql – Add categories to knowledge base
-- Run in Supabase SQL Editor after 007_time_entries.sql
-- ============================================================

ALTER TABLE kb_entries
  ADD COLUMN IF NOT EXISTS category TEXT;

-- Create index for better filtering performance
CREATE INDEX IF NOT EXISTS kb_entries_category_idx ON kb_entries(category);

-- Update existing entries to have default category
UPDATE kb_entries
SET category = 'General'
WHERE category IS NULL;

-- END 008_kb_categories.sql

-- ============================================================
-- BEGIN 009_manual_time_entries.sql
-- ============================================================

-- ============================================================
-- 009_manual_time_entries.sql – Manual time entry support
-- Run in Supabase SQL Editor after 008_kb_categories.sql
-- ============================================================

ALTER TABLE time_entries
  ADD COLUMN IF NOT EXISTS is_manual BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';

-- Create index for better filtering performance
CREATE INDEX IF NOT EXISTS time_entries_category_idx ON time_entries(category);
CREATE INDEX IF NOT EXISTS time_entries_manual_idx ON time_entries(is_manual);

-- Update existing entries to have default category
UPDATE time_entries
SET category = 'General'
WHERE category IS NULL;

-- END 009_manual_time_entries.sql

-- ============================================================
-- BEGIN 010_messages.sql
-- ============================================================

-- Migration: 010_messages
-- Creates the messages table for client <-> VA communication.
-- One shared thread per client_id (all VAs and the client_admin see the same feed).

create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references clients(id) on delete cascade,
  sender_id   uuid not null references auth.users(id) on delete cascade,
  sender_name text not null default '',
  sender_role text not null check (sender_role in ('client_admin', 'va', 'super_admin')),
  body        text not null check (char_length(body) > 0 and char_length(body) <= 4000),
  read_by     uuid[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- Index for fetching all messages in a client thread, newest last
create index if not exists messages_client_id_created_at_idx
  on messages (client_id, created_at asc);

-- Index for unread count queries
create index if not exists messages_sender_id_idx
  on messages (sender_id);

-- RLS
alter table messages enable row level security;

-- VA or client_admin can read messages for their own client_id
create policy "messages_select"
  on messages for select
  using (
    client_id in (
      select client_id from users where id = auth.uid() and client_id is not null
    )
  );

-- Sending is handled via edge function using service role key.
-- No direct insert RLS needed — edge function bypasses RLS.

-- END 010_messages.sql

-- ============================================================
-- BEGIN 011_vault_enhancements.sql
-- ============================================================

-- Migration: 011_vault_enhancements
-- Adds AI metadata columns to vault_items and fixes RLS for VA insert/update.

-- ── New columns ───────────────────────────────────────────────────────────────
ALTER TABLE vault_items
  ADD COLUMN IF NOT EXISTS category TEXT
    CHECK (category IN ('process','policy','service','contact','reference','general')),
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Index for category-based queries in kb-generate / content-generate
CREATE INDEX IF NOT EXISTS vault_items_category_idx ON vault_items (client_id, category);
CREATE INDEX IF NOT EXISTS vault_items_status_idx   ON vault_items (client_id, status);

-- ── RLS additions ─────────────────────────────────────────────────────────────

-- VAs can INSERT vault items for their own client (was missing — VAs were blocked)
CREATE POLICY "vault_va_insert"
  ON vault_items FOR INSERT
  WITH CHECK (
    current_user_role() = 'va'
    AND client_id = current_user_client_id()
  );

-- Any user (client_admin or VA) can UPDATE items they created, or client_admin can update any
CREATE POLICY "vault_own_update"
  ON vault_items FOR UPDATE
  USING (
    created_by = auth.uid()
    OR current_user_role() = 'client_admin'
  )
  WITH CHECK (
    client_id = current_user_client_id()
    OR current_user_role() = 'super_admin'
  );

-- END 011_vault_enhancements.sql

-- ============================================================
-- BEGIN 012_team_fields_va_vault.sql
-- ============================================================

-- ============================================================
-- 012_team_fields_va_vault.sql
-- Adds extended VA profile fields and fixes vault RLS for VAs.
-- Safe to re-run (IF NOT EXISTS / OR REPLACE guards throughout).
-- ============================================================

-- ── Extended VA profile fields ────────────────────────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS salary           NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS payment_terms    TEXT,
  ADD COLUMN IF NOT EXISTS payment_details  TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp         TEXT,
  ADD COLUMN IF NOT EXISTS personal_email   TEXT,
  ADD COLUMN IF NOT EXISTS address          TEXT,
  ADD COLUMN IF NOT EXISTS timezone         TEXT,
  ADD COLUMN IF NOT EXISTS skills           TEXT[];

-- ── Vault: ensure new columns exist (idempotent with 011) ─────────────────────
ALTER TABLE vault_items
  ADD COLUMN IF NOT EXISTS category   TEXT
    CHECK (category IN ('process','policy','service','contact','reference','general')),
  ADD COLUMN IF NOT EXISTS tags       TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Indexes (idempotent)
CREATE INDEX IF NOT EXISTS vault_items_category_idx ON vault_items (client_id, category);
CREATE INDEX IF NOT EXISTS vault_items_status_idx   ON vault_items (client_id, status);

-- ── Vault RLS: grant VAs SELECT access ────────────────────────────────────────
-- The original vault_own_client_select policy covers all roles including VA,
-- but the INSERT policy blocked VAs. This migration adds explicit VA insert access.
-- Drop the old VA insert policy if it exists from 011, then re-create cleanly.
DROP POLICY IF EXISTS "vault_va_insert"  ON vault_items;
DROP POLICY IF EXISTS "vault_own_update" ON vault_items;

-- VAs can INSERT vault items for their own client
CREATE POLICY "vault_va_insert"
  ON vault_items FOR INSERT
  WITH CHECK (
    current_user_role() = 'va'
    AND client_id = current_user_client_id()
  );

-- Any authenticated user can UPDATE their own items; client_admin can update any
CREATE POLICY "vault_own_update"
  ON vault_items FOR UPDATE
  USING (
    created_by = auth.uid()
    OR current_user_role() IN ('client_admin', 'super_admin')
  )
  WITH CHECK (
    client_id = current_user_client_id()
    OR current_user_role() = 'super_admin'
  );

-- ── RLS: allow client_admin to manage VA extended fields ──────────────────────
-- The existing users_update_own_profile allows VAs to update themselves.
-- Add a policy so client_admins can update VA profile fields in their client.
DROP POLICY IF EXISTS "users_client_admin_update_va" ON users;
CREATE POLICY "users_client_admin_update_va"
  ON users FOR UPDATE
  USING (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
    AND role = 'va'
  )
  WITH CHECK (
    current_user_role() = 'client_admin'
    AND client_id = current_user_client_id()
  );

-- END 012_team_fields_va_vault.sql

-- ============================================================
-- BEGIN 013_fix_rls_recursion.sql
-- ============================================================

-- ============================================================
-- 013_fix_rls_recursion.sql
--
-- ROOT CAUSE: current_user_role() and current_user_client_id()
-- query the `users` table without SECURITY DEFINER.
-- When any RLS policy on vault_items (or any other table) calls
-- these helpers, Postgres evaluates them under the calling user's
-- permissions, which means it must apply RLS on `users`, which
-- calls the same helpers again → infinite recursion.
--
-- FIX: Recreate both helpers as SECURITY DEFINER so they execute
-- as the function owner (postgres superuser role) and bypass RLS
-- entirely. This is the standard Supabase pattern for helper
-- functions used inside RLS policies.
-- ============================================================

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION current_user_client_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT client_id FROM users WHERE id = auth.uid()
$$;

-- END 013_fix_rls_recursion.sql

-- ============================================================
-- BEGIN 014_content_topics.sql
-- ============================================================

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

-- END 014_content_topics.sql

-- ============================================================
-- BEGIN 015_vault_content_hash.sql
-- ============================================================

-- ============================================================
-- 015_vault_content_hash.sql
-- Adds content_hash for deduplication on vault_items.
-- Run in Supabase SQL Editor after 014_content_topics.sql
-- ============================================================

ALTER TABLE vault_items
  ADD COLUMN IF NOT EXISTS content_hash TEXT;

-- Index for fast duplicate detection within a client
CREATE INDEX IF NOT EXISTS vault_items_content_hash_idx
  ON vault_items (client_id, content_hash)
  WHERE content_hash IS NOT NULL;

-- END 015_vault_content_hash.sql

-- ============================================================
-- BEGIN 016_missing_indexes.sql
-- ============================================================

-- ============================================================
-- 016_missing_indexes.sql – Missing performance indexes
-- Run in Supabase SQL Editor after 015_vault_content_hash.sql
-- ============================================================

-- crm_notes: every openContact() filters by contact_id — without this index
-- it does a full table scan on every contact panel open.
CREATE INDEX IF NOT EXISTS crm_notes_contact_id_idx
  ON crm_notes(contact_id);

-- time_entries: GET /api/time-entries filters on (user_id, work_date).
-- Composite index serves both the equality filter and the order by started_at.
CREATE INDEX IF NOT EXISTS time_entries_user_date_idx
  ON time_entries(user_id, work_date, started_at);

-- sops: list query orders by (client_id, category, order_index).
-- Composite index covers the WHERE + ORDER BY without a filesort.
CREATE INDEX IF NOT EXISTS sops_client_category_idx
  ON sops(client_id, category, order_index);

-- vault_items: status filter used in VaultClient stats and filtering.
CREATE INDEX IF NOT EXISTS vault_items_client_status_idx
  ON vault_items(client_id, status);

-- END 016_missing_indexes.sql

-- ============================================================
-- BEGIN 017_security_hardening.sql
-- ============================================================

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

-- END 017_security_hardening.sql

-- ============================================================
-- BEGIN 018_job_ad_ingestion.sql
-- ============================================================

-- ============================================================
-- 018_job_ad_ingestion.sql
-- Phase 1: tenant-scoped, single-URL job-ad ingestion.
-- Run after 017_security_hardening.sql.
-- ============================================================

CREATE TABLE IF NOT EXISTS job_ads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  source_url            TEXT NOT NULL,
  canonical_url         TEXT NOT NULL,
  source_host           TEXT NOT NULL,
  source_job_id         TEXT,
  title                 TEXT NOT NULL,
  company_name          TEXT,
  company_website       TEXT,
  location              TEXT,
  remote_type           TEXT NOT NULL DEFAULT 'unknown'
                          CHECK (remote_type IN ('onsite', 'hybrid', 'remote', 'unknown')),
  employment_type       TEXT,
  salary_min            NUMERIC(14,2),
  salary_max            NUMERIC(14,2),
  salary_currency       TEXT,
  salary_period         TEXT,
  description           TEXT NOT NULL,
  responsibilities      TEXT[] NOT NULL DEFAULT '{}',
  skills                TEXT[] NOT NULL DEFAULT '{}',
  posted_at             TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ,
  apply_url             TEXT,
  raw_content           TEXT NOT NULL,
  raw_content_hash      TEXT NOT NULL,
  extraction_method     TEXT NOT NULL
                          CHECK (extraction_method IN ('json_ld', 'ai', 'json_ld+ai')),
  extraction_confidence NUMERIC(4,3) NOT NULL DEFAULT 0
                          CHECK (extraction_confidence >= 0 AND extraction_confidence <= 1),
  field_evidence        JSONB NOT NULL DEFAULT '{}'::jsonb,
  status                TEXT NOT NULL DEFAULT 'needs_review'
                          CHECK (status IN (
                            'discovered',
                            'extracted',
                            'needs_review',
                            'approved',
                            'rejected',
                            'expired',
                            'error'
                          )),
  created_by            UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT job_ads_client_canonical_url_key UNIQUE (client_id, canonical_url),
  CONSTRAINT job_ads_salary_order_check
    CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
);

CREATE INDEX IF NOT EXISTS job_ads_client_status_updated_idx
  ON job_ads (client_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS job_ads_client_company_idx
  ON job_ads (client_id, lower(company_name))
  WHERE company_name IS NOT NULL;

CREATE INDEX IF NOT EXISTS job_ads_content_hash_idx
  ON job_ads (client_id, raw_content_hash);

CREATE TABLE IF NOT EXISTS job_scrape_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id         UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  job_ad_id         UUID REFERENCES job_ads(id) ON DELETE SET NULL,
  requested_url     TEXT NOT NULL,
  canonical_url     TEXT,
  status            TEXT NOT NULL DEFAULT 'running'
                      CHECK (status IN ('running', 'completed', 'failed')),
  provider          TEXT NOT NULL DEFAULT 'firecrawl',
  extraction_method TEXT,
  http_status       INTEGER,
  tokens_used       INTEGER NOT NULL DEFAULT 0,
  duration_ms       INTEGER,
  error_code        TEXT,
  error_message     TEXT,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS job_scrape_runs_client_started_idx
  ON job_scrape_runs (client_id, started_at DESC);

CREATE INDEX IF NOT EXISTS job_scrape_runs_job_ad_idx
  ON job_scrape_runs (job_ad_id, started_at DESC)
  WHERE job_ad_id IS NOT NULL;

ALTER TABLE job_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_scrape_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_ads_super_admin_all" ON job_ads;
CREATE POLICY "job_ads_super_admin_all"
  ON job_ads FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "job_ads_own_client_select" ON job_ads;
CREATE POLICY "job_ads_own_client_select"
  ON job_ads FOR SELECT
  USING (client_id = current_user_client_id());

DROP POLICY IF EXISTS "job_ads_client_admin_update" ON job_ads;
CREATE POLICY "job_ads_client_admin_update"
  ON job_ads FOR UPDATE
  USING (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  )
  WITH CHECK (
    client_id = current_user_client_id()
    AND current_user_role() = 'client_admin'
  );

DROP POLICY IF EXISTS "job_scrape_runs_super_admin_all" ON job_scrape_runs;
CREATE POLICY "job_scrape_runs_super_admin_all"
  ON job_scrape_runs FOR ALL
  USING (current_user_role() = 'super_admin')
  WITH CHECK (current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "job_scrape_runs_own_client_select" ON job_scrape_runs;
CREATE POLICY "job_scrape_runs_own_client_select"
  ON job_scrape_runs FOR SELECT
  USING (client_id = current_user_client_id());

GRANT SELECT, UPDATE ON TABLE job_ads TO authenticated;
GRANT SELECT ON TABLE job_scrape_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE job_ads TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE job_scrape_runs TO service_role;

-- END 018_job_ad_ingestion.sql

COMMIT;

-- Verification summary
SELECT jsonb_build_object(
  'installed_tables',
  (
    SELECT jsonb_agg(table_name ORDER BY table_name)
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN (
        'sops',
        'content_pieces',
        'daily_logs',
        'daily_log_notes',
        'time_entries',
        'messages',
        'content_topics',
        'api_rate_limits',
        'job_ads',
        'job_scrape_runs'
      )
  ),
  'migration_complete',
  (
    to_regclass('public.job_ads') IS NOT NULL
    AND to_regclass('public.job_scrape_runs') IS NOT NULL
    AND to_regprocedure('public.consume_api_rate_limit(text,integer,integer)') IS NOT NULL
  )
) AS rapidtal_migration_result;
