/** @jest-environment node */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseJobPostingJsonLd,
  validateJobExtraction,
  type JobAdExtraction,
} from "../supabase/functions/_shared/job-ad";
import { parseOpenAiJobExtractionResponse } from "../supabase/functions/_shared/openai-job";

type Fixture = {
  key: string;
  kind: "structured" | "dynamic" | "incomplete" | "expired";
  url: string;
  expected: Record<string, unknown>;
};

const fixtureDir = join(process.cwd(), "__tests__/fixtures/job-ads");
const fixtures = JSON.parse(
  readFileSync(join(fixtureDir, "manifest.json"), "utf8"),
) as Fixture[];

function html(key: string): string {
  return readFileSync(join(fixtureDir, `${key}.html`), "utf8");
}

function matchesExpected(
  extraction: JobAdExtraction,
  expected: Record<string, unknown>,
): boolean {
  return Object.entries(expected).every(([key, value]) =>
    JSON.stringify(extraction[key as keyof JobAdExtraction]) === JSON.stringify(value)
  );
}

describe("Phase 7 representative job-ad fixtures", () => {
  test("extracts a complete structured advertisement without AI", () => {
    const fixture = fixtures.find((item) => item.kind === "structured")!;
    const extraction = parseJobPostingJsonLd(html(fixture.key), fixture.url);
    expect(extraction).not.toBeNull();
    expect(matchesExpected(extraction!, fixture.expected)).toBe(true);
    expect(validateJobExtraction(extraction!)).toBeNull();
  });

  test("uses mocked rendered content and AI for a dynamic advertisement", () => {
    const fixture = fixtures.find((item) => item.kind === "dynamic")!;
    expect(parseJobPostingJsonLd(html(fixture.key), fixture.url)).toBeNull();
    const response = parseOpenAiJobExtractionResponse({
      choices: [{
        message: {
          content: JSON.stringify({
            is_job_ad: true,
            title: "Customer Success Manager",
            company_name: "Dynamic Fixture Co",
            location: "Melbourne, VIC",
            remote_type: "hybrid",
            description: "Own customer onboarding, adoption, retention, and expansion for a growing portfolio of Australian business customers.",
            responsibilities: ["Lead onboarding", "Improve retention"],
            skills: ["Customer success", "CRM"],
            field_evidence: {
              title: "Customer Success Manager",
              company_name: "Dynamic Fixture Co",
              location: "Melbourne, VIC",
              description: "Own customer onboarding, adoption, retention, and expansion.",
            },
          }),
        },
      }],
      usage: { prompt_tokens: 1000, completion_tokens: 500, total_tokens: 1500 },
    });
    expect(matchesExpected(response.extraction, fixture.expected)).toBe(true);
    expect(validateJobExtraction(response.extraction)).toBeNull();
    expect(response.tokensUsed).toBe(1500);
    expect(response.estimatedCostUsd).toBe(0.00045);
  });

  test("flags incomplete structured content for enrichment rather than inventing facts", () => {
    const fixture = fixtures.find((item) => item.kind === "incomplete")!;
    const extraction = parseJobPostingJsonLd(html(fixture.key), fixture.url);
    expect(extraction).not.toBeNull();
    expect(matchesExpected(extraction!, fixture.expected)).toBe(true);
    expect(extraction!.confidence).toBeLessThan(0.9);
    expect(validateJobExtraction(extraction!)).not.toBeNull();
  });

  test("preserves expiry data for an expired advertisement", () => {
    const fixture = fixtures.find((item) => item.kind === "expired")!;
    const extraction = parseJobPostingJsonLd(html(fixture.key), fixture.url);
    expect(extraction).not.toBeNull();
    expect(matchesExpected(extraction!, fixture.expected)).toBe(true);
    expect(Date.parse(extraction!.expires_at!)).toBeLessThan(Date.now());
  });

  test("fixture release gate has all four representative kinds", () => {
    expect(new Set(fixtures.map((fixture) => fixture.kind))).toEqual(
      new Set(["structured", "dynamic", "incomplete", "expired"]),
    );
  });
});
