import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { proxyToEdgeFunction } from "@/lib/edge-proxy";

export const maxDuration = 150;

const schema = z.object({
  clientId: z.string().uuid(),
  source: z.enum(["seek", "indeed", "linkedin"]),
  searchTerm: z.string().trim().min(2).max(120),
  location: z.string().trim().max(120).default(""),
  country: z.string().trim().length(2).transform((value) => value.toUpperCase()).default("AU"),
  workType: z.string().trim().max(50).default(""),
  dateRangeDays: z.number().int().min(1).max(30).default(7),
  maxResults: z.number().int().min(10).max(50).default(25),
}).strict();

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  if (!["super_admin", "client_admin"].includes(auth.user.role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body: unknown = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid job-search filters are required." }, { status: 400 });
  }
  const accessError = assertClientAccess(auth.user, parsed.data.clientId);
  if (accessError) return accessError;

  return proxyToEdgeFunction("job-ad-discover", parsed.data);
}
