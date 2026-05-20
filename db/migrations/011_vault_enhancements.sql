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
