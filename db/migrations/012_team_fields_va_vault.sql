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
