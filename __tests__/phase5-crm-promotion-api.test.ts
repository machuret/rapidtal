/** @jest-environment node */

import { NextRequest, NextResponse } from "next/server";
import { POST as promote } from "@/app/api/job-leads/promote/route";
import { POST as addContact } from "@/app/api/job-leads/verified-contact/route";
import { assertClientAccess, requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

jest.mock("@/lib/api-auth", () => ({
  requireApiAuth: jest.fn(),
  assertClientAccess: jest.fn(),
}));
jest.mock("@/lib/supabase/admin", () => ({ createAdminClient: jest.fn() }));

const clientId = "11111111-1111-4111-8111-111111111111";
const jobAdId = "22222222-2222-4222-8222-222222222222";
const companyId = "33333333-3333-4333-8333-333333333333";
const crmCompanyId = "44444444-4444-4444-8444-444444444444";
const userId = "55555555-5555-4555-8555-555555555555";

function request(path: string, body: Record<string, unknown>) {
  return new NextRequest(`https://rapidtal.example${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Phase 5 CRM APIs", () => {
  const rpc = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(requireApiAuth).mockResolvedValue({
      user: { id: userId, role: "client_admin", client_id: clientId },
    });
    jest.mocked(assertClientAccess).mockReturnValue(null);
    rpc.mockImplementation((name: string) => Promise.resolve({
      data: name === "consume_api_rate_limit" ? true : [{ id: crmCompanyId }],
      error: null,
    }));
    jest.mocked(createAdminClient).mockReturnValue({ rpc } as never);
  });

  test("promotes only through the approval-gated RPC", async () => {
    const response = await promote(request("/api/job-leads/promote", { clientId, jobAdId, companyId }));
    expect(response.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith("promote_lead_company_to_crm", {
      p_actor_id: userId,
      p_client_id: clientId,
      p_job_ad_id: jobAdId,
      p_company_id: companyId,
    });
  });

  test("rejects a person without email or phone before the database call", async () => {
    const response = await addContact(request("/api/job-leads/verified-contact", {
      clientId,
      crmCompanyId,
      firstName: "Sam",
      verificationMethod: "company_website",
      sourceUrl: "https://example.com/team",
      evidenceNote: "Sam is listed as Head of Sales.",
    }));
    expect(response.status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  test("stops before mutation when tenant access is denied", async () => {
    jest.mocked(assertClientAccess).mockReturnValue(
      NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    );
    const response = await promote(request("/api/job-leads/promote", { clientId, jobAdId, companyId }));
    expect(response.status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });
});
