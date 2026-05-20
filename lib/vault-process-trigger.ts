/**
 * Server-side helper to trigger vault-process edge function
 * after raw_content is written to a vault item.
 *
 * Uses service role key + a service JWT approach — the edge function
 * expects a Bearer JWT. Since this runs server-side with the service key,
 * we call the edge function directly with the service role key as the bearer.
 *
 * Fire-and-forget: errors are logged but never thrown, so the calling
 * route always returns success immediately after content extraction.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function triggerVaultProcess(itemId: string, clientId: string): Promise<void> {
  const edgeUrl = `${SUPABASE_URL}/functions/v1/vault-process`;

  try {
    const res = await fetch(edgeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "apikey": SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ itemId, clientId }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "unknown error");
      console.warn(`[vault-process trigger] Item ${itemId} failed: ${res.status} ${err}`);
    } else {
      console.log(`[vault-process trigger] Item ${itemId} processing started`);
    }
  } catch (err) {
    // Non-fatal — item is still usable, just won't have AI metadata yet
    console.warn(`[vault-process trigger] Failed to call edge fn for item ${itemId}:`, err);
  }
}
