/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  COMPANY_FIELDS,
  normalizeCompanyExtraction,
} from "../supabase/functions/_shared/company-enrichment";

type CompanyFixture = {
  key: string;
  pages: Record<string, string>;
  extraction: unknown;
  expected: Record<string, unknown>;
};

const fixturePath = join(
  process.cwd(),
  "__tests__/fixtures/companies/manifest.json",
);
const fixtures = JSON.parse(readFileSync(fixturePath, "utf8")) as CompanyFixture[];

describe("company enrichment fixture release gate", () => {
  test("covers at least four representative companies and every required field", () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(4);
    for (const fixture of fixtures) {
      expect(new Set(Object.keys(fixture.expected))).toEqual(new Set(COMPANY_FIELDS));
      expect(Object.keys(fixture.pages).length).toBeGreaterThanOrEqual(2);
    }
  });

  test("enforces at least 95% aggregate source-backed field accuracy", () => {
    let matched = 0;
    let measured = 0;

    for (const fixture of fixtures) {
      const result = normalizeCompanyExtraction(
        fixture.extraction,
        new Map(Object.entries(fixture.pages)),
      );
      for (const [field, expected] of Object.entries(fixture.expected)) {
        measured += 1;
        if (
          JSON.stringify(result.sourceBacked[field as keyof typeof result.sourceBacked])
          === JSON.stringify(expected)
        ) {
          matched += 1;
        }
      }
    }

    expect(measured).toBeGreaterThanOrEqual(20);
    expect(matched / measured).toBeGreaterThanOrEqual(0.95);
  });

  test("keeps fixture inferences separate from source-backed company fields", () => {
    const fixture = fixtures.find((item) => item.key === "professional-services")!;
    const result = normalizeCompanyExtraction(
      fixture.extraction,
      new Map(Object.entries(fixture.pages)),
    );
    expect(result.inferredData.services).toEqual(["Finance transformation"]);
    expect(result.sourceBacked.services).toEqual(["Business advisory", "Virtual CFO"]);
  });
});
