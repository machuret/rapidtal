/** @jest-environment node */

import {
  actorForSource,
  buildDiscoveryActorInput,
  discoveryAccessBarrier,
  discoveryContentFingerprint,
  isCompleteDiscoverySnapshot,
  isPublicDiscoveryActorInput,
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
      country: "australia",
      maxResults: 25,
      dateRange: 7,
      sortBy: "ListedDate",
      workTypes: ["fulltime"],
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
    expect(jobs[0].content_fingerprint).toMatch(/^[0-9a-f]{16}$/);
  });

  test("rejects unsafe and incomplete actor rows", () => {
    expect(normalizeDiscoveryDataset("indeed", [
      { positionName: "Role without URL" },
      { positionName: "Internal role", url: "http://localhost/job/1" },
      null,
    ], "AU", 25)).toEqual([]);
  });

  test("rejects cross-source URLs and authentication barriers", () => {
    expect(normalizeDiscoveryDataset("seek", [
      { title: "Wrong source", jobLink: "https://www.indeed.com/viewjob?jk=1" },
      { title: "Login", jobLink: "https://www.seek.com.au/login/job/1" },
    ], "AU", 25)).toEqual([]);

    expect(normalizeDiscoveryDataset("linkedin", [
      { title: "Authwall", jobUrl: "https://www.linkedin.com/authwall/jobs/view/1" },
    ], "AU", 25)).toEqual([]);
  });

  test("stops on CAPTCHA or login output and forbids credentials in actor input", () => {
    expect(discoveryAccessBarrier([{ errorMessage: "CAPTCHA challenge required" }]))
      .toBe("captcha");
    expect(discoveryAccessBarrier({ finalUrl: "https://example.com/login required" }))
      .toBe("login_required");
    expect(discoveryAccessBarrier([{ title: "Normal public result" }])).toBeNull();

    expect(isPublicDiscoveryActorInput({ query: "sales", nested: { max: 10 } })).toBe(true);
    expect(isPublicDiscoveryActorInput({ query: "sales", cookies: ["secret"] })).toBe(false);
    expect(isPublicDiscoveryActorInput({ nested: { session: "secret" } })).toBe(false);
  });

  test("only treats complete, untruncated datasets as expiry evidence", () => {
    expect(isCompleteDiscoverySnapshot([{ id: 1 }], 1, 25)).toBe(true);
    expect(isCompleteDiscoverySnapshot(new Array(25).fill({}), 25, 25)).toBe(false);
    expect(isCompleteDiscoverySnapshot([{ id: 1 }, { id: 2 }], 1, 25)).toBe(false);
    expect(isCompleteDiscoverySnapshot({ items: [] }, 0, 25)).toBe(false);
  });

  test("content fingerprints are stable and change with meaningful fields", () => {
    const base = {
      source: "seek" as const,
      source_job_id: "42",
      job_url: "https://www.seek.com.au/job/42",
      canonical_url: "https://www.seek.com.au/job/42",
      title: "Sales Manager",
      company_name: "Acme",
      company_website: null,
      location: "Sydney",
      country: "AU",
      salary_text: null,
      work_type: "Full time",
      work_arrangement: null,
      summary: "Build the team.",
      listed_at: null,
      expires_at: null,
    };
    const first = discoveryContentFingerprint(base);
    expect(discoveryContentFingerprint({ ...base })).toBe(first);
    expect(discoveryContentFingerprint({ ...base, summary: "Lead the team." }))
      .not.toBe(first);
  });
});
