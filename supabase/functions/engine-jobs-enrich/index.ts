/**
 * Retired legacy endpoint.
 *
 * This authenticated tombstone replaces the former public job-enrichment
 * endpoint. Approved advertisements now use company-enrich and human review.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.105.1";

const headers = { "Content-Type": "application/json" };

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers,
    });
  }

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized." }), {
      status: 401,
      headers,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return new Response(JSON.stringify({ error: "Service unavailable." }), {
      status: 503,
      headers,
    });
  }

  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized." }), {
      status: 401,
      headers,
    });
  }

  return new Response(JSON.stringify({
    error: "This legacy job-enrichment endpoint has been retired.",
    code: "endpoint_retired",
    replacement: "company-enrich",
  }), {
    status: 410,
    headers,
  });
});
