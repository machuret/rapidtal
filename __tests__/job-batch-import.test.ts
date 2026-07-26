/** @jest-environment node */

import { normalizeJobUrl, parseJobImportText } from "@/lib/job-batch-import";
import { canonicalizePublicJobUrl } from "@/supabase/functions/_shared/job-url";

describe("job batch import", () => {
  test("accepts HTTPS URLs from lines and real CSV while normalizing tracking parameters", () => {
    const parsed = parseJobImportText([
      "url,company",
      "https://EXAMPLE.com/jobs/1/?utm_source=email",
      "\"https://example.com/jobs/2?team=sales,marketing\",\"Acme, Ltd\"",
      "https://example.com/jobs/3;Example Ltd",
    ].join("\n"));
    expect(parsed.urls).toEqual([
      "https://example.com/jobs/1/",
      "https://example.com/jobs/2?team=sales%2Cmarketing",
      "https://example.com/jobs/3",
    ]);
    expect(parsed.invalidCount).toBe(0);
  });

  test("preserves commas and semicolons inside a whole-line URL", () => {
    const parsed = parseJobImportText(
      "https://example.com/jobs/4?teams=sales,marketing;priority",
    );
    expect(parsed.urls).toEqual([
      "https://example.com/jobs/4?teams=sales%2Cmarketing%3Bpriority",
    ]);
  });

  test("warns about repeats and bounds a batch to 25 unique jobs", () => {
    const values = [
      "https://example.com/jobs/1",
      "https://example.com/jobs/1#apply",
      ...Array.from({ length: 30 }, (_, index) => `https://example.com/openings/${index}`),
    ];
    const parsed = parseJobImportText(values.join("\n"));
    expect(parsed.urls).toHaveLength(25);
    expect(parsed.repeatedCount).toBe(1);
    expect(parsed.overflowCount).toBe(6);
  });

  test("rejects insecure and malformed URLs", () => {
    expect(normalizeJobUrl("http://example.com/job")).toBeNull();
    expect(normalizeJobUrl("not a url")).toBeNull();
    expect(normalizeJobUrl("https://user:password@example.com/job")).toBeNull();
  });

  test("uses exactly the same canonical URL as backend ingestion", () => {
    const vectors = [
      "https://Jobs.Example.com/role/?utm_source=email&source=partner#apply",
      "https://jobs.example.com/role?gclid=123&team=sales",
      "https://jobs.example.com/role?access_token=secret&job=42",
    ];
    for (const value of vectors) {
      expect(normalizeJobUrl(value)).toBe(
        canonicalizePublicJobUrl(value)?.canonicalUrl ?? null,
      );
    }
  });
});
