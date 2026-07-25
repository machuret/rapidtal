/** @jest-environment node */

import {
  actorForSource,
  buildDiscoveryActorInput,
  normalizeDiscoveryDataset,
} from "../supabase/functions/_shared/job-discovery";

describe("job discovery adapters", () => {
  test("uses bounded source-specific actor inputs", () => {
    const params = {
      searchTerm: "marketing manager",
      location: "Sydney",
      country: "AU",
      maxResults: 25,
      dateRangeDays: 7,
      workType: "fulltime",
    };
    expect(buildDiscoveryActorInput("seek", params)).toMatchObject({
      searchTerm: "marketing manager",
      location: "Sydney",
      maxResults: 25,
      dateRange: 7,
      workType: ["fulltime"],
    });
    expect(buildDiscoveryActorInput("indeed", params)).toMatchObject({
      position: "marketing manager",
      country: "AU",
      maxItemsPerSearch: 25,
    });
    expect(buildDiscoveryActorInput("linkedin", params)).toMatchObject({
      searchQueries: ["marketing manager"],
      location: "Sydney",
      maxJobs: 25,
      datePosted: "past-week",
      jobType: ["fulltime"],
    });
  });

  test("supports validated actor overrides without losing defaults", () => {
    expect(actorForSource("seek")).toBe("websift~seek-job-scraper");
    expect(actorForSource("linkedin", { linkedin: "vendor~custom-jobs" }))
      .toBe("vendor~custom-jobs");
    expect(actorForSource("indeed", { seek: "vendor~seek" }))
      .toBe("misceres~indeed-scraper");
  });

  test("normalizes SEEK output, strips tracking, and deduplicates URLs", () => {
    const jobs = normalizeDiscoveryDataset("seek", [
      {
        id: "42",
        title: "Growth Manager",
        jobLink: "https://www.seek.com.au/job/42?utm_source=feed",
        advertiser: { name: "Acme" },
        joblocationInfo: { displayLocation: "Sydney NSW", countryCode: "AU" },
        salary: "$120k",
        workTypes: ["Full time"],
        content: { unEditedContent: "Lead growth across the organisation." },
        listedAt: "2026-07-24T00:00:00Z",
      },
      {
        id: "duplicate",
        title: "Growth Manager",
        jobLink: "https://www.seek.com.au/job/42?utm_campaign=duplicate",
      },
    ], "AU", 25);

    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      source: "seek",
      source_job_id: "42",
      canonical_url: "https://www.seek.com.au/job/42",
      job_url: "https://www.seek.com.au/job/42",
      company_name: "Acme",
      location: "Sydney NSW",
      country: "AU",
      salary_text: "$120k",
      work_type: "Full time",
    });
  });

  test("rejects unsafe and incomplete actor rows", () => {
    expect(normalizeDiscoveryDataset("indeed", [
      { positionName: "Role without URL" },
      { positionName: "Internal role", url: "http://localhost/job/1" },
      null,
    ], "AU", 25)).toEqual([]);
  });
});
