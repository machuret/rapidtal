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
