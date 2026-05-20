import { NextRequest } from "next/server";
import { proxyToEdgeFunction } from "@/lib/edge-proxy";

export async function POST(req: NextRequest) {
  const body = await req.json();
  return proxyToEdgeFunction("company-dna-scrape", body);
}
