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
