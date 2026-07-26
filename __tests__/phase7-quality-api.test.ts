/** @jest-environment node */

import { NextRequest, NextResponse } from "next/server";
import { POST } from "@/app/api/job-leads/quality-measurements/route";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

jest.mock("@/lib/api-auth", () => ({
  requireApiAuth: jest.fn(),
  assertClientAccess: jest.fn(),
}));
jest.mock("@/lib/supabase/admin", () => ({ createAdminClient: jest.fn() }));

const clientId = "11111111-1111-4111-8111-111111111111";
const userId = "22222222-2222-4222-8222-222222222222";
const jobAdId = "33333333-3333-4333-8333-333333333333";

function request(body: Record<string, unknown>) {
  return new NextRequest("https://rapidtal.example/api/job-leads/quality-measurements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Phase 7 quality measurement API", () => {
  const rpc = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(requireApiAuth).mockResolvedValue({
      user: { id: userId, role: "client_admin", client_id: clientId },
    });
    jest.mocked(assertClientAccess).mockReturnValue(null);
    rpc.mockImplementation((name: string) => Promise.resolve({
      data: name === "consume_api_rate_limit"
        ? true
        : [{ id: "44444444-4444-4444-8444-444444444444", field_accuracy: 0.5 }],
      error: null,
    }));
    jest.mocked(createAdminClient).mockReturnValue({ rpc } as never);
  });

  test("saves a labeled sample through the verified database function", async () => {
    const response = await POST(request({
      clientId,
      jobAdId,
      fixtureKey: "production-job-42",
      fixtureKind: "production_sample",
      expectedFields: { title: "Sales Manager", location: "Sydney" },
      actualFields: { title: "Sales Manager", location: "Melbourne" },
    }));
    expect(response.status).toBe(201);
    expect(rpc).toHaveBeenCalledWith("save_job_extraction_quality_measurement", {
      p_actor_id: userId,
      p_client_id: clientId,
      p_payload: {
        job_ad_id: jobAdId,
        scrape_run_id: null,
        fixture_key: "production-job-42",
        fixture_kind: "production_sample",
        expected_fields: { title: "Sales Manager", location: "Sydney" },
        actual_fields: { title: "Sales Manager", location: "Melbourne" },
      },
    });
  });

  test("rejects empty labels before any mutation", async () => {
    const response = await POST(request({
      clientId,
      fixtureKey: "empty",
      fixtureKind: "structured",
      expectedFields: {},
      actualFields: {},
    }));
    expect(response.status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  test("stops before mutation when tenant access is denied", async () => {
    jest.mocked(assertClientAccess).mockReturnValue(
      NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    );
    const response = await POST(request({
      clientId,
      fixtureKey: "tenant-test",
      fixtureKind: "structured",
      expectedFields: { title: "Role" },
      actualFields: { title: "Role" },
    }));
    expect(response.status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });
});
