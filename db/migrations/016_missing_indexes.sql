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
