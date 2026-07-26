/** @jest-environment node */

import { normalizeJobUrl, parseJobImportText } from "@/lib/job-batch-import";

describe("job batch import", () => {
  test("accepts HTTPS URLs from lines and CSV while normalizing tracking parameters", () => {
    const parsed = parseJobImportText([
      "url",
      "https://EXAMPLE.com/jobs/1/?utm_source=email",
      "\"https://example.com/jobs/2,https://example.com/jobs/3\"",
    ].join("\n"));
    expect(parsed.urls).toEqual([
      "https://example.com/jobs/1",
      "https://example.com/jobs/2",
      "https://example.com/jobs/3",
    ]);
    expect(parsed.invalidCount).toBe(1);
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
  });
});
