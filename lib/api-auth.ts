import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ApiUser {
  id: string;
  role: string;
  client_id: string | null;
}

/**
 * Validates the incoming request session via Supabase cookie auth.
 * Returns the authenticated user row (id, role, client_id) or a 401 NextResponse.
 * Never trusts clientId/userId from the request body for auth purposes.
 */
export async function requireApiAuth(): Promise<{ user: ApiUser } | { error: NextResponse }> {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() { /* read-only in API routes */ },
      },
    }
  );

  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    return {
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  // TODO (perf): once a Supabase custom_access_token_hook is configured to embed
  // `user_role` and `user_client_id` as JWT claims, replace this DB lookup with:
  //   const role = authUser.app_metadata?.user_role
  //   const client_id = authUser.app_metadata?.user_client_id
  // That eliminates this DB call entirely on every API request.
  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("users")
    .select("id, role, client_id")
    .eq("id", authUser.id)
    .single();

  if (!userRow) {
    return {
      error: NextResponse.json({ error: "User record not found." }, { status: 403 }),
    };
  }

  return { user: userRow as ApiUser };
}

/**
 * Asserts the authenticated user owns or has access to the given clientId.
 * super_admin can access any client. Others must match their own client_id.
 */
export function assertClientAccess(user: ApiUser, clientId: string): NextResponse | null {
  if (user.role === "super_admin") return null;
  if (user.client_id !== clientId) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  return null;
}
