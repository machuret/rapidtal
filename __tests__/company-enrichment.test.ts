/** @jest-environment node */

import {
  buildCompanyCrawlerInput,
  normalizeCompanyExtraction,
  parseCompanyDataset,
  parseOfficialCompanyUrl,
} from "../supabase/functions/_shared/company-enrichment";

describe("company enrichment", () => {
  test("accepts an official public HTTPS company URL", () => {
    expect(parseOfficialCompanyUrl("https://www.example.com/about")).toEqual({
      domain: "example.com",
      hostname: "www.example.com",
      websiteUrl: "https://www.example.com/",
    });
  });

  test.each([
    "http://example.com",
    "https://localhost/about",
    "https://127.0.0.1/",
    "https://www.seek.com.au/job/1",
    "https://company.greenhouse.io/jobs/1",
    "https://user:pass@example.com/",
  ])("rejects an unsafe or job-board company URL: %s", (url) => {
    expect(parseOfficialCompanyUrl(url)).toBeNull();
  });

  test("limits the crawl to approved company page paths and four pages", () => {
    const input = buildCompanyCrawlerInput("https://example.com/");
    expect(input.maxCrawlPages).toBe(4);
    expect(input.maxCrawlDepth).toBe(0);
    expect(input.startUrls).toEqual([
      { url: "https://example.com/" },
      { url: "https://example.com/about" },
      { url: "https://example.com/services" },
      { url: "https://example.com/contact" },
    ]);
  });

  test("keeps only same-domain company pages", () => {
    const pages = parseCompanyDataset([
      { url: "https://www.example.com/about", markdown: "A".repeat(100) },
      { loadedUrl: "https://example.com/services", text: "B".repeat(100) },
      { url: "https://evil.example.net/contact", markdown: "C".repeat(100) },
      { url: "http://example.com/contact", markdown: "D".repeat(100) },
    ], "example.com");
    expect(pages.map((page) => page.url)).toEqual([
      "https://www.example.com/about",
      "https://example.com/services",
    ]);
  });

  test("separates source-backed facts from inferences", () => {
    const sourceUrl = "https://example.com/about";
    const result = normalizeCompanyExtraction({
      source_backed: {
        name: {
          value: "Example Pty Ltd",
          source_url: sourceUrl,
          excerpt: "Example Pty Ltd provides...",
          confidence: 0.98,
        },
        industry: { value: null, source_url: null, excerpt: null, confidence: 0 },
        location: { value: null, source_url: null, excerpt: null, confidence: 0 },
        description: { value: null, source_url: null, excerpt: null, confidence: 0 },
        services: [],
      },
      inferred: [{
        field: "industry",
        value: "Technology consulting",
        rationale: "The company describes cloud implementation services.",
        confidence: 0.7,
      }],
    }, new Set([sourceUrl]));

    expect(result.sourceBacked.name).toBe("Example Pty Ltd");
    expect(result.sourceBacked.industry).toBeNull();
    expect(result.inferredData.industry).toBe("Technology consulting");
    expect(result.facts.map((fact) => fact.fact_type)).toEqual([
      "source_backed",
      "inferred",
    ]);
  });

  test("drops source claims that cite an unapproved URL", () => {
    const result = normalizeCompanyExtraction({
      source_backed: {
        name: {
          value: "Fabricated Company",
          source_url: "https://other.example/fake",
          excerpt: "Fabricated Company",
          confidence: 1,
        },
        industry: { value: null, source_url: null, excerpt: null, confidence: 0 },
        location: { value: null, source_url: null, excerpt: null, confidence: 0 },
        description: { value: null, source_url: null, excerpt: null, confidence: 0 },
        services: [],
      },
      inferred: [],
    }, new Set(["https://example.com/about"]));
    expect(result.sourceBacked.name).toBeNull();
    expect(result.facts).toEqual([]);
  });
});
