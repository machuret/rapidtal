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
    }])).toEqual({
      markdown: "# Senior Engineer\nBuild reliable systems.",
      html: "<script type=\"application/ld+json\">{}</script>",
    });
  });

  test("accepts fallback output fields and rejects unusable datasets", () => {
    expect(parseApifyDatasetItems([{ text: "Job content", rawHtml: "<main>Job</main>" }]))
      .toEqual({ markdown: "Job content", html: "<main>Job</main>" });
    expect(parseApifyDatasetItems([])).toBeNull();
    expect(parseApifyDatasetItems([{ url: "https://example.com" }])).toBeNull();
  });
});
