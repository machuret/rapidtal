/** @jest-environment node */

import { NextRequest, NextResponse } from "next/server";
import { PATCH } from "@/app/api/job-leads/alerts/route";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

jest.mock("@/lib/api-auth", () => ({
  requireApiAuth: jest.fn(),
  assertClientAccess: jest.fn(),
}));
jest.mock("@/lib/supabase/admin", () => ({ createAdminClient: jest.fn() }));

const clientId = "11111111-1111-4111-8111-111111111111";
const userId = "22222222-2222-4222-8222-222222222222";
const alertId = "33333333-3333-4333-8333-333333333333";

function request(body: Record<string, unknown>) {
  return new NextRequest("https://rapidtal.example/api/job-leads/alerts", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Phase 7 alert API", () => {
  const rpc = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(requireApiAuth).mockResolvedValue({
      user: { id: userId, role: "client_admin", client_id: clientId },
    });
    jest.mocked(assertClientAccess).mockReturnValue(null);
    rpc.mockResolvedValue({
      data: [{ id: alertId, status: "acknowledged" }],
      error: null,
    });
    jest.mocked(createAdminClient).mockReturnValue({ rpc } as never);
  });

  test("acknowledges through the tenant-checked atomic function", async () => {
    const response = await PATCH(request({ clientId, alertId, action: "acknowledged" }));
    expect(response.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("review_job_pipeline_alert", {
      p_actor_id: userId,
      p_client_id: clientId,
      p_alert_id: alertId,
      p_action: "acknowledged",
    });
  });

  test("rejects unsupported actions", async () => {
    const response = await PATCH(request({ clientId, alertId, action: "deleted" }));
    expect(response.status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  test("does not mutate an alert when tenant access is denied", async () => {
    jest.mocked(assertClientAccess).mockReturnValue(
      NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    );
    const response = await PATCH(request({ clientId, alertId, action: "resolved" }));
    expect(response.status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });
});
