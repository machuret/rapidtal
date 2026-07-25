/** @jest-environment node */

import { NextRequest, NextResponse } from "next/server";
import { PATCH } from "@/app/api/job-leads/review/route";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

jest.mock("@/lib/api-auth", () => ({
  requireApiAuth: jest.fn(),
  assertClientAccess: jest.fn(),
}));

jest.mock("@/lib/supabase/admin", () => ({
  createAdminClient: jest.fn(),
}));

const mockRequireApiAuth = jest.mocked(requireApiAuth);
const mockAssertClientAccess = jest.mocked(assertClientAccess);
const mockCreateAdminClient = jest.mocked(createAdminClient);

const clientId = "11111111-1111-4111-8111-111111111111";
const jobAdId = "22222222-2222-4222-8222-222222222222";
const userId = "33333333-3333-4333-8333-333333333333";

function request(body: Record<string, unknown>): NextRequest {
  return new NextRequest("https://rapidtal.example/api/job-leads/review", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("job-lead review API", () => {
  const rpc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireApiAuth.mockResolvedValue({
      user: { id: userId, role: "client_admin", client_id: clientId },
    });
    mockAssertClientAccess.mockReturnValue(null);
    rpc.mockResolvedValue({
      data: [{ id: jobAdId, client_id: clientId, status: "approved" }],
      error: null,
    });
    mockCreateAdminClient.mockReturnValue({ rpc } as never);
  });

  test("uses the atomic review RPC for an authorized tenant admin", async () => {
    const response = await PATCH(request({
      clientId,
      jobAdId,
      status: "approved",
    }));

    expect(response.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("review_job_ad", {
      p_actor_id: userId,
      p_client_id: clientId,
      p_job_ad_id: jobAdId,
      p_status: "approved",
      p_notes: null,
    });
  });

  test("does not call the review RPC when tenant access is denied", async () => {
    mockAssertClientAccess.mockReturnValue(
      NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    );

    const response = await PATCH(request({
      clientId,
      jobAdId,
      status: "rejected",
    }));

    expect(response.status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });

  test("rejects unsupported status transitions", async () => {
    const response = await PATCH(request({
      clientId,
      jobAdId,
      status: "expired",
    }));

    expect(response.status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });
});
