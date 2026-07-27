/** @jest-environment node */

import {
  discoverJobsWithApify,
  DiscoveryProviderError,
} from "../supabase/functions/_shared/job-discovery-provider";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const parameters = {
  searchTerm: "sales manager",
  location: "Sydney",
  country: "AU",
  maxResults: 10,
  dateRangeDays: 7,
  workType: "",
};

describe("job discovery provider workflow", () => {
  test("runs a bounded public adapter and normalizes results", async () => {
    const onRunStarted = jest.fn().mockResolvedValue(undefined);
    const fetcher = jest.fn()
      .mockResolvedValueOnce(jsonResponse({
        data: {
          id: "discovery-1",
          status: "SUCCEEDED",
          defaultDatasetId: "dataset-1",
          usageTotalUsd: 0.05,
        },
      }))
      .mockResolvedValueOnce(jsonResponse([{
        url: "https://www.seek.com.au/job/12345678",
        title: "Sales Manager",
        company: "Example Co",
        location: "Sydney NSW",
      }]));

    const result = await discoverJobsWithApify({
      actor: "actor-owner~seek-scraper",
      apiKey: "secret",
      source: "seek",
      parameters,
      maxChargeUsd: 1,
    }, { fetcher, onRunStarted });

    expect(result).toMatchObject({
      providerRunId: "discovery-1",
      providerCostUsd: 0.05,
      discoveries: [{
        title: "Sales Manager",
        company_name: "Example Co",
      }],
    });
    expect(onRunStarted).toHaveBeenCalledWith("discovery-1");
    expect(fetcher.mock.calls[0][0]).toContain(
      "maxItems=10&maxTotalChargeUsd=1",
    );
  });

  test("stops and backs off when a source presents an access barrier", async () => {
    const fetcher = jest.fn()
      .mockResolvedValueOnce(jsonResponse({
        data: {
          id: "discovery-2",
          status: "SUCCEEDED",
          defaultDatasetId: "dataset-2",
          usageTotalUsd: 0.01,
        },
      }))
      .mockResolvedValueOnce(jsonResponse([{
        url: "https://www.seek.com.au/login",
        title: "Sign in to continue",
        message: "Complete the CAPTCHA to continue",
      }]));

    await expect(discoverJobsWithApify({
      actor: "actor-owner~seek-scraper",
      apiKey: "secret",
      source: "seek",
      parameters,
      maxChargeUsd: 1,
    }, { fetcher })).rejects.toMatchObject<Partial<DiscoveryProviderError>>({
      responseStatus: 409,
      code: "source_access_blocked",
      retryAfterSeconds: 86_400,
      providerRunId: "discovery-2",
    });
  });
});
