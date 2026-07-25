/** @jest-environment node */

import {
  calculateLeadScore,
  LEAD_SCORE_MAX_POINTS,
  LEAD_SCORING_RULESET,
  type LeadScoringCompanyInput,
  type LeadScoringJobInput,
  type LeadScoringProfileInput,
} from "../lib/lead-scoring";

const now = new Date("2026-07-26T00:00:00.000Z");

const profile: LeadScoringProfileInput = {
  version: 3,
  targetRoles: ["Sales Development Representative", "SEO Specialist"],
  targetGeographies: ["Sydney", "Australia"],
  preferredIndustries: ["Technology"],
  companyFitKeywords: ["cloud"],
};

const job: LeadScoringJobInput = {
  title: "Sales Development Representative",
  companyName: "Example Cloud",
  location: "Sydney NSW, Australia",
  remoteType: "remote",
  employmentType: "Full-time",
  description: "Urgent hiring now for a sales professional to support our cloud growth.",
  responsibilities: ["Build pipeline", "Book qualified meetings"],
  skills: ["CRM", "Outbound sales"],
  postedAt: "2026-07-23T00:00:00.000Z",
  expiresAt: "2026-07-31T00:00:00.000Z",
  extractionConfidence: 0.9,
};

const company: LeadScoringCompanyInput = {
  domain: "example.com",
  industry: "Technology consulting",
  location: "Sydney",
  services: ["Cloud implementation"],
  description: "Cloud consulting for growing companies.",
  evidence: {
    name: {},
    industry: {},
    location: {},
    services: [],
    description: {},
  },
};

function component(
  result: ReturnType<typeof calculateLeadScore>,
  key: keyof typeof LEAD_SCORE_MAX_POINTS,
) {
  return result.components.find((entry) => entry.component === key);
}

describe("transparent lead scoring ruleset", () => {
  test("calculates a fully explained high-priority lead without AI", () => {
    const result = calculateLeadScore(job, company, profile, now);
    expect(result.rulesetVersion).toBe(LEAD_SCORING_RULESET);
    expect(result.totalScore).toBe(98);
    expect(result.scoreBand).toBe("high");
    expect(result.summary).toContain("Strong role match");
    expect(result.summary).toContain("Sydney target geography");
    expect(result.summary).toContain("recent advertisement");
    expect(result.summary).toContain("company domain verified");
    expect(result.components).toHaveLength(7);
    expect(result.components.reduce((sum, item) => sum + item.maxPoints, 0)).toBe(100);
    for (const item of result.components) {
      expect(item.reason.length).toBeGreaterThan(10);
      expect(item.points).toBeGreaterThanOrEqual(0);
      expect(item.points).toBeLessThanOrEqual(item.maxPoints);
      expect(item.inputs).toEqual(expect.any(Object));
    }
  });

  test.each([
    ["2026-07-19T00:00:00.000Z", 15],
    ["2026-07-12T00:00:00.000Z", 12],
    ["2026-06-26T00:00:00.000Z", 8],
    ["2026-05-27T00:00:00.000Z", 4],
    ["2026-05-26T00:00:00.000Z", 0],
  ])("applies the documented recency boundary for %s", (postedAt, expected) => {
    const result = calculateLeadScore({ ...job, postedAt }, company, profile, now);
    expect(component(result, "advertisement_recency")?.points).toBe(expected);
  });

  test("does not match target terms inside unrelated words", () => {
    const result = calculateLeadScore(
      { ...job, title: "Wholesale Inventory Coordinator", description: "Manage wholesale stock." },
      company,
      { ...profile, targetRoles: ["sales"] },
      now,
    );
    expect(component(result, "target_role")?.points).toBe(0);
  });

  test("does not award a partial match for a generic role suffix alone", () => {
    const result = calculateLeadScore(
      { ...job, title: "Human Resources Specialist", description: "Support the people team." },
      company,
      { ...profile, targetRoles: ["SEO Specialist"] },
      now,
    );
    expect(component(result, "target_role")?.points).toBe(0);
  });

  test("does not match urgency text inside an unrelated longer word", () => {
    const result = calculateLeadScore(
      {
        ...job,
        description: "Write research about an insurgent movement.",
        expiresAt: null,
      },
      company,
      profile,
      now,
    );
    expect(component(result, "hiring_urgency")?.points).toBe(0);
  });

  test("awards no recency points to a future posting date", () => {
    const result = calculateLeadScore(
      { ...job, postedAt: "2026-07-27T00:00:00.000Z" },
      company,
      profile,
      now,
    );
    expect(component(result, "advertisement_recency")?.points).toBe(0);
    expect(component(result, "advertisement_recency")?.reason).toContain("future");
  });

  test("keeps missing dates and confidence conservative", () => {
    const result = calculateLeadScore(
      {
        ...job,
        location: null,
        remoteType: "unknown",
        postedAt: null,
        expiresAt: null,
        extractionConfidence: 0,
        description: "Short",
        skills: [],
      },
      { ...company, evidence: {} },
      { ...profile, targetGeographies: ["Perth"] },
      now,
    );
    expect(component(result, "target_geography")?.points).toBe(0);
    expect(component(result, "advertisement_recency")?.points).toBe(0);
    expect(component(result, "hiring_urgency")?.points).toBe(0);
    expect(component(result, "data_completeness_confidence")?.points).toBeLessThanOrEqual(3);
  });

  test("is deterministic for identical inputs and evaluation time", () => {
    expect(calculateLeadScore(job, company, profile, now))
      .toEqual(calculateLeadScore(job, company, profile, now));
  });
});
