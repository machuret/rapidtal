/** @jest-environment node */

import {
  normalizeManualDiscoveryRequest,
  normalizeScheduledDiscoveryRequest,
  validateDiscoveryRequest,
} from "../supabase/functions/_shared/job-discovery-request";

const actorId = "11111111-1111-4111-8111-111111111111";
const clientId = "22222222-2222-4222-8222-222222222222";
const searchId = "33333333-3333-4333-8333-333333333333";

describe("discovery request normalization", () => {
  test("normalizes manual filters into one bounded request", () => {
    const request = normalizeManualDiscoveryRequest({
      clientId,
      source: "seek",
      searchTerm: "  sales   manager ",
      location: " Sydney ",
      country: "au",
      workType: "full-time",
      maxResults: 25,
      dateRangeDays: 7,
    }, actorId);

    expect(request).toMatchObject({
      actorId,
      clientId,
      source: "seek",
      searchId: null,
      parameters: {
        searchTerm: "sales manager",
        location: "Sydney",
        country: "AU",
      },
    });
    expect(validateDiscoveryRequest(request)).toBeNull();
  });

  test("normalizes database snake-case fields for a leased search", () => {
    const request = normalizeScheduledDiscoveryRequest({
      schedule_approved_by: actorId,
      client_id: clientId,
      source: "indeed",
      search_term: "account executive",
      location: "Melbourne",
      country: "AU",
      work_type: "",
      max_results: 20,
      date_range_days: 14,
      compliance_policy_version: "policy-v1",
    }, searchId);

    expect(request).toMatchObject({
      actorId,
      clientId,
      source: "indeed",
      searchId,
      policyVersion: "policy-v1",
      parameters: {
        searchTerm: "account executive",
        maxResults: 20,
        dateRangeDays: 14,
      },
    });
    expect(validateDiscoveryRequest(request)).toBeNull();
  });

  test("rejects unsupported result and date ranges", () => {
    const request = normalizeManualDiscoveryRequest({
      clientId,
      source: "seek",
      searchTerm: "sales",
      country: "AU",
      maxResults: 500,
      dateRangeDays: 0,
    }, actorId);

    expect(validateDiscoveryRequest(request)).toBe(
      "Search filters are outside the supported limits.",
    );
  });
});
