import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { canonicalizePublicJobUrl } from "@/supabase/functions/_shared/job-url";

const schema = z.object({
  clientId: z.string().uuid(),
  urls: z.array(z.string().trim().max(2048)).min(1).max(26),
}).strict();

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (!["super_admin", "client_admin"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "One to 26 job URLs are required." }, { status: 400 });
  }
  const accessError = assertClientAccess(auth.user, parsed.data.clientId);
  if (accessError) return accessError;

  const canonicalUrls = [...new Set(parsed.data.urls.flatMap((value) => {
    const parsedUrl = canonicalizePublicJobUrl(value);
    return parsedUrl ? [parsedUrl.canonicalUrl] : [];
  }))];
  if (canonicalUrls.length !== parsed.data.urls.length) {
    return NextResponse.json({ error: "Every URL must be a public HTTPS job URL." }, { status: 400 });
  }

  const { data, error } = await createAdminClient()
    .from("job_ads")
    .select("canonical_url")
    .eq("client_id", parsed.data.clientId)
    .in("canonical_url", canonicalUrls);
  if (error) {
    return NextResponse.json({ error: "Duplicate lookup failed." }, { status: 500 });
  }
  return NextResponse.json({
    existingUrls: (data ?? []).map((item) => item.canonical_url),
  });
}
