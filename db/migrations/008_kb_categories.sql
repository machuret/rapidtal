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
