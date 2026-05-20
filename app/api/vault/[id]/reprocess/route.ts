/**
 * POST /api/vault/[id]/reprocess — Trigger vault-process edge function on an existing item.
 * Re-runs AI extraction to refresh ai_summary, category, and tags.
 * Auth: requireApiAuth() — any authenticated user with client access.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { proxyToEdgeFunction } from "@/lib/edge-proxy";
import { z } from "zod";

const schema = z.object({ clientId: z.string().uuid() });

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing clientId." }, { status: 400 });
  }

  const accessError = assertClientAccess(user, parsed.data.clientId);
  if (accessError) return accessError;

  return proxyToEdgeFunction("vault-process", {
    itemId: params.id,
    clientId: parsed.data.clientId,
  });
}
