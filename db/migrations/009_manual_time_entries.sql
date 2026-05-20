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
