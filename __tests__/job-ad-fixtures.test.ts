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

function dynamicFixtureExtraction(): JobAdExtraction {
  return parseOpenAiJobExtractionResponse({
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
  }).extraction;
}

function fixtureExtraction(fixture: Fixture): JobAdExtraction | null {
  return fixture.kind === "dynamic"
    ? dynamicFixtureExtraction()
    : parseJobPostingJsonLd(html(fixture.key), fixture.url);
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
    expect(fixtures.length).toBeGreaterThanOrEqual(8);
    expect(new Set(fixtures.map((fixture) => fixture.kind))).toEqual(
      new Set(["structured", "dynamic", "incomplete", "expired"]),
    );
  });

  test("enforces at least 95% aggregate required-field accuracy", () => {
    const requiredFields = new Set([
      "source_job_id", "title", "company_name", "company_website", "location",
      "remote_type", "employment_type", "salary_min", "salary_max",
      "salary_currency", "salary_period", "description", "responsibilities",
      "skills", "posted_at", "expires_at", "apply_url",
    ]);
    const coveredFields = new Set(fixtures.flatMap((fixture) => Object.keys(fixture.expected)));
    for (const field of requiredFields) expect(coveredFields).toContain(field);

    let matched = 0;
    let measured = 0;
    for (const fixture of fixtures) {
      const extraction = fixtureExtraction(fixture);
      expect(extraction).not.toBeNull();
      for (const [field, expected] of Object.entries(fixture.expected)) {
        measured += 1;
        if (
          JSON.stringify(extraction![field as keyof JobAdExtraction])
          === JSON.stringify(expected)
        ) {
          matched += 1;
        }
      }
    }
    expect(measured).toBeGreaterThanOrEqual(70);
    expect(matched / measured).toBeGreaterThanOrEqual(0.95);
  });
});
