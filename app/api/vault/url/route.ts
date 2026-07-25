import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { triggerVaultProcess } from "@/lib/vault-process-trigger";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url(),
  clientId: z.string().uuid(),
});

const PRIVATE_IP_RE = /^(localhost|127\.|0\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|::1|fc00:|fe80:)/i;

function isBlockedUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") return true;
    if (PRIVATE_IP_RE.test(parsed.hostname)) return true;
    return false;
  } catch {
    return true;
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { title, url, clientId } = parsed.data;
  const userId = user.id;

  if (isBlockedUrl(url)) {
    return NextResponse.json({ error: "Only public HTTPS URLs are allowed." }, { status: 400 });
  }

  const accessError = assertClientAccess(user, clientId);
  if (accessError) return accessError;

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) {
    return NextResponse.json(
      { error: "URL scraping is not configured." },
      { status: 503 },
    );
  }

  const supabase = createAdminClient();
  const { data: rateAllowed, error: rateError } = await supabase.rpc("consume_api_rate_limit", {
    p_key: `vault-url:${user.id}`,
    p_limit: 10,
    p_window_seconds: 60,
  });
  if (rateError) {
    return NextResponse.json({ error: "Rate limiter unavailable." }, { status: 503 });
  }
  if (!rateAllowed) {
    return NextResponse.json(
      { error: "Too many crawl requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const { data: item, error: insertError } = await supabase
    .from("vault_items")
    .insert({
      client_id: clientId,
      source_type: "url",
      title,
      source_url: url,
      status: "processing",
      created_by: userId,
    })
    .select()
    .single();

  if (insertError || !item) {
    return NextResponse.json({ error: insertError?.message ?? "Insert failed" }, { status: 500 });
  }

  const itemId = (item as { id: string }).id;

  try {
    const crawlRes = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({ url, formats: ["markdown"] }),
      signal: AbortSignal.timeout(45_000),
    });
    const crawlData = await crawlRes.json().catch(() => null);
    const content = crawlData?.data?.markdown ?? crawlData?.markdown ?? "";

    if (!crawlRes.ok || typeof content !== "string" || content.trim().length < 20) {
      const message = crawlData?.error ?? `Firecrawl returned HTTP ${crawlRes.status}`;
      throw new Error(message);
    }

    // Generate content hash for deduplication
    const contentHash = createHash("sha256").update(content).digest("hex");

    // Check for duplicate URL content within the same client
    const { data: duplicate } = await supabase
      .from("vault_items")
      .select("id, title")
      .eq("client_id", clientId)
      .eq("content_hash", contentHash)
      .neq("id", itemId)
      .maybeSingle();

    if (duplicate) {
      await supabase.from("vault_items").delete().eq("id", itemId);
      return NextResponse.json(
        { error: `Duplicate content. This URL matches existing item "${(duplicate as { title: string }).title}".` },
        { status: 409 }
      );
    }

    const { error: updateError } = await supabase
      .from("vault_items")
      .update({ raw_content: content, content_hash: contentHash, status: "ready" })
      .eq("id", itemId);
    if (updateError) throw new Error(updateError.message);

    // Wait until the processing request has been accepted before ending the route.
    await triggerVaultProcess(itemId, clientId);
    return NextResponse.json({ success: true, itemId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "URL crawl failed.";
    await supabase
      .from("vault_items")
      .update({ status: "error", error_message: message.slice(0, 1000) })
      .eq("id", itemId);
    return NextResponse.json({ error: "Failed to crawl URL." }, { status: 502 });
  }
}
