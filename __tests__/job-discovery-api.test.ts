/** @jest-environment node */

import { NextRequest, NextResponse } from "next/server";
import { POST } from "@/app/api/job-leads/discover/route";
import { PATCH } from "@/app/api/job-leads/discovery/route";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { proxyToEdgeFunction } from "@/lib/edge-proxy";
import { createAdminClient } from "@/lib/supabase/admin";

jest.mock("@/lib/api-auth", () => ({
  requireApiAuth: jest.fn(),
  assertClientAccess: jest.fn(),
}));
jest.mock("@/lib/edge-proxy", () => ({ proxyToEdgeFunction: jest.fn() }));
jest.mock("@/lib/supabase/admin", () => ({ createAdminClient: jest.fn() }));

const clientId = "11111111-1111-4111-8111-111111111111";
const discoveryId = "22222222-2222-4222-8222-222222222222";
const userId = "33333333-3333-4333-8333-333333333333";

function request(path: string, method: string, body: Record<string, unknown>): NextRequest {
  return new NextRequest(`https://rapidtal.example${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("job discovery APIs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(requireApiAuth).mockResolvedValue({
      user: { id: userId, role: "client_admin", client_id: clientId },
    });
    jest.mocked(assertClientAccess).mockReturnValue(null);
    jest.mocked(proxyToEdgeFunction).mockResolvedValue(
      NextResponse.json({ success: true, count: 2 }),
    );
  });

  test("validates and proxies a tenant discovery search", async () => {
    const response = await POST(request("/api/job-leads/discover", "POST", {
      clientId,
      source: "seek",
      searchTerm: "Marketing manager",
      location: "Sydney",
      country: "au",
      workType: "",
      dateRangeDays: 7,
      maxResults: 25,
    }));

    expect(response.status).toBe(200);
    expect(proxyToEdgeFunction).toHaveBeenCalledWith("job-ad-discover", {
      clientId,
      source: "seek",
      searchTerm: "Marketing manager",
      location: "Sydney",
      country: "AU",
      workType: "",
      dateRangeDays: 7,
      maxResults: 25,
    });
  });

  test("rejects searches above the cost-bounding result limit", async () => {
    const response = await POST(request("/api/job-leads/discover", "POST", {
      clientId,
      source: "seek",
      searchTerm: "Marketing",
      location: "",
      country: "AU",
      workType: "",
      dateRangeDays: 7,
      maxResults: 500,
    }));

    expect(response.status).toBe(400);
    expect(proxyToEdgeFunction).not.toHaveBeenCalled();
  });

  test("scopes dismissals to the authorized tenant", async () => {
    const query = {
      update: jest.fn(),
      eq: jest.fn(),
      neq: jest.fn(),
      select: jest.fn(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: { id: discoveryId, status: "dismissed" },
        error: null,
      }),
    };
    query.update.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.neq.mockReturnValue(query);
    query.select.mockReturnValue(query);
    jest.mocked(createAdminClient).mockReturnValue({
      from: jest.fn().mockReturnValue(query),
    } as never);

    const response = await PATCH(request("/api/job-leads/discovery", "PATCH", {
      clientId,
      discoveryId,
      status: "dismissed",
    }));

    expect(response.status).toBe(200);
    expect(query.eq).toHaveBeenCalledWith("id", discoveryId);
    expect(query.eq).toHaveBeenCalledWith("client_id", clientId);
    expect(query.neq).toHaveBeenCalledWith("status", "imported");
  });
});
