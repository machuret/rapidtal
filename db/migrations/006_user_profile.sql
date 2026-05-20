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
