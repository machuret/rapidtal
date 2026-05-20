import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DbUser, DbClient } from "@/types/database";

export interface CurrentUserAndClient {
  user: DbUser;
  client: DbClient | null;
}

/**
 * Fetches the authenticated user + their client in a single DB query.
 * Wrapped with React.cache() so multiple callers within the same server
 * render tree (e.g. layout + page) share one result — zero duplicate queries.
 */
export const getCurrentUserAndClient = cache(
  async (): Promise<CurrentUserAndClient | null> => {
    const supabase = createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) return null;

    const admin = createAdminClient();

    const { data: userRow } = await admin
      .from("users")
      .select("id, email, full_name, role, client_id, created_at, phone, birthday, avatar_url")
      .eq("id", authUser.id)
      .single();

    if (!userRow) return null;

    const user = userRow as DbUser;

    let client: DbClient | null = null;
    if (user.client_id) {
      const { data } = await admin
        .from("clients")
        .select("id, name, slug, created_at, created_by")
        .eq("id", user.client_id)
        .single();
      client = (data as DbClient) ?? null;
    }

    return { user, client };
  }
);

export async function requireRole(
  allowedRoles: DbUser["role"][]
): Promise<CurrentUserAndClient> {
  const result = await getCurrentUserAndClient();
  if (!result) throw new Error("UNAUTHENTICATED");
  if (!allowedRoles.includes(result.user.role)) throw new Error("FORBIDDEN");
  return result;
}
