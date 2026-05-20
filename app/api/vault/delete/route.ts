/**
 * POST /api/vault/delete — Bulk delete vault items + storage objects.
 * Proxies to vault-delete edge function which handles cross-tenant verification
 * and storage cleanup using the service role key (safe — never client-exposed).
 * Auth: client_admin or super_admin only (enforced by edge function).
 */

import { NextRequest } from "next/server";
import { proxyToEdgeFunction } from "@/lib/edge-proxy";

export async function POST(req: NextRequest) {
  const body = await req.json();
  return proxyToEdgeFunction("vault-delete", body);
}
