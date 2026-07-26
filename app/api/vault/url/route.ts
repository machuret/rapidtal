import { NextResponse } from "next/server";

/**
 * Retired duplicate Vault URL reader.
 *
 * The UI and all supported callers use /api/vault/crawl, which owns public URL
 * validation, Firecrawl retrieval, AI structuring, deduplication, and storage.
 */
export async function POST() {
  return NextResponse.json({
    error: "This Vault URL endpoint has been retired.",
    code: "endpoint_retired",
    replacement: "/api/vault/crawl",
  }, { status: 410 });
}
