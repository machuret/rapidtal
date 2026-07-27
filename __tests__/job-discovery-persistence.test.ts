/** @jest-environment node */

import {
  normalizeDiscoveryCounts,
  prepareDiscoveryCompletion,
  prepareDiscoveryRunPayload,
  prepareSavedSearchPayload,
} from "../supabase/functions/_shared/job-discovery-persistence";
import type { NormalizedDiscoveryRequest } from "../supabase/functions/_shared/job-discovery-request";

const request: NormalizedDiscoveryRequest = {
  actorId: "11111111-1111-4111-8111-111111111111",
  clientId: "22222222-2222-4222-8222-222222222222",
  source: "seek",
  parameters: {
    searchTerm: "sales manager",
    location: "Sydney",
    country: "AU",
    workType: "",
    maxResults: 25,
    dateRangeDays: 7,
  },
  searchId: null,
  policyVersion: null,
};

describe("job discovery persistence preparation", () => {
  test("maps one request into saved-search and run records", () => {
    expect(prepareSavedSearchPayload(request, "2026-07-27T00:00:00Z"))
      .toMatchObject({
        client_id: request.clientId,
        source: "seek",
        search_term: "sales manager",
        date_range_days: 7,
        max_results: 25,
        created_by: request.actorId,
      });
    expect(prepareDiscoveryRunPayload({
      request,
      searchId: "33333333-3333-4333-8333-333333333333",
      scheduled: false,
      leaseToken: null,
      adapterVersion: "seek-v1",
    })).toMatchObject({
      trigger_type: "manual",
      adapter_version: "seek-v1",
      compliance_policy_version: null,
    });
  });

  test("normalizes RPC counts and builds the completion audit", () => {
    const counts = normalizeDiscoveryCounts({
      result_count: "12",
      new_count: 5,
      changed_count: 2,
      expired_count: 1,
    });

    expect(prepareDiscoveryCompletion({
      counts,
      completeSnapshot: true,
      providerCostUsd: 0.05,
      durationMs: 2_000,
      completedAt: "2026-07-27T00:00:00Z",
    })).toEqual({
      status: "completed",
      result_count: 12,
      new_count: 5,
      changed_count: 2,
      expired_count: 1,
      complete_snapshot: true,
      cost_usd: 0.05,
      duration_ms: 2_000,
      completed_at: "2026-07-27T00:00:00Z",
    });
  });
});
