/** @jest-environment node */

import {
  buildApifyWebsiteContentInput,
  isApifyRunPending,
  parseApifyDatasetItems,
  parseApifyRun,
} from "../supabase/functions/_shared/apify";

describe("Apify job-content adapter", () => {
  test("builds a bounded single-page Website Content Crawler input", () => {
    expect(buildApifyWebsiteContentInput("https://jobs.example.com/role/42")).toMatchObject({
      startUrls: [{ url: "https://jobs.example.com/role/42" }],
      crawlerType: "playwright:adaptive",
      maxCrawlPages: 1,
      maxCrawlDepth: 0,
      useSitemaps: false,
      blockMedia: true,
      saveMarkdown: true,
      saveHtml: true,
      saveHtmlAsFile: false,
    });
  });

  test("parses run envelopes and recognizes only active statuses as pending", () => {
    expect(parseApifyRun({
      data: {
        id: "run-123",
        status: "RUNNING",
        defaultDatasetId: "dataset-123",
        usageTotalUsd: 0.018,
      },
    })).toEqual({
      id: "run-123",
      status: "RUNNING",
      defaultDatasetId: "dataset-123",
      usageTotalUsd: 0.018,
    });
    expect(isApifyRunPending("READY")).toBe(true);
    expect(isApifyRunPending("RUNNING")).toBe(true);
    expect(isApifyRunPending("SUCCEEDED")).toBe(false);
    expect(isApifyRunPending("FAILED")).toBe(false);
    expect(parseApifyRun({ data: { status: "RUNNING" } })).toBeNull();
  });

  test("normalizes the first dataset item and preserves HTML for JSON-LD", () => {
    expect(parseApifyDatasetItems([{
      markdown: "  # Senior Engineer\nBuild reliable systems.  ",
      html: "<script type=\"application/ld+json\">{}</script>",
      requestedUrl: "https://jobs.example.com/old?token=secret",
      loadedUrl: "https://jobs.example.com/role/42",
      statusCode: 200,
      redirectUrls: ["https://jobs.example.com/old?utm_source=test"],
    }])).toEqual({
      markdown: "# Senior Engineer\nBuild reliable systems.",
      html: "<script type=\"application/ld+json\">{}</script>",
      finalUrl: "https://jobs.example.com/role/42",
      statusCode: 200,
      redirectHistory: [
        "https://jobs.example.com/old",
        "https://jobs.example.com/role/42",
      ],
    });
  });

  test("accepts fallback output fields and rejects unusable datasets", () => {
    expect(parseApifyDatasetItems([{ text: "Job content", rawHtml: "<main>Job</main>" }]))
      .toEqual({
        markdown: "Job content",
        html: "<main>Job</main>",
        finalUrl: null,
        statusCode: null,
        redirectHistory: [],
      });
    expect(parseApifyDatasetItems([])).toBeNull();
    expect(parseApifyDatasetItems([{ url: "https://example.com" }])).toBeNull();
  });

  test("reads target telemetry from nested Apify crawler metadata", () => {
    expect(parseApifyDatasetItems([{
      content: "Rendered vacancy content",
      request: {
        url: "https://jobs.example.com/start?token=secret",
        loadedUrl: "https://jobs.example.com/final?utm_campaign=hiring",
      },
      crawl: {
        httpStatusCode: 202,
        redirectChain: [
          { url: "https://jobs.example.com/start?token=secret" },
          { url: "https://jobs.example.com/final?utm_campaign=hiring" },
        ],
      },
    }])).toEqual({
      markdown: "Rendered vacancy content",
      html: "",
      finalUrl: "https://jobs.example.com/final",
      statusCode: 202,
      redirectHistory: [
        "https://jobs.example.com/start",
        "https://jobs.example.com/final",
      ],
    });
  });
});
