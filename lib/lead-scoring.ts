export const LEAD_SCORING_RULESET = "phase4-v1";

export const LEAD_SCORE_MAX_POINTS = {
  target_role: 25,
  target_geography: 15,
  advertisement_recency: 15,
  hiring_urgency: 15,
  company_fit: 10,
  outsourcing_suitability: 10,
  data_completeness_confidence: 10,
} as const;

export type LeadScoreComponentKey = keyof typeof LEAD_SCORE_MAX_POINTS;
export type LeadScoreBand = "high" | "medium" | "low";

export interface LeadScoringProfileInput {
  version: number;
  targetRoles: string[];
  targetGeographies: string[];
  preferredIndustries: string[];
  companyFitKeywords: string[];
}

export interface LeadScoringJobInput {
  title: string;
  companyName: string | null;
  location: string | null;
  remoteType: "onsite" | "hybrid" | "remote" | "unknown";
  employmentType: string | null;
  description: string;
  responsibilities: string[];
  skills: string[];
  postedAt: string | null;
  expiresAt: string | null;
  extractionConfidence: number;
}

export interface LeadScoringCompanyInput {
  domain: string;
  industry: string | null;
  location: string | null;
  services: string[];
  description: string | null;
  evidence: Record<string, unknown>;
}

export interface LeadScoreComponent {
  component: LeadScoreComponentKey;
  points: number;
  maxPoints: number;
  reason: string;
  inputs: Record<string, unknown>;
  summaryFragment: string | null;
}

export interface CalculatedLeadScore {
  rulesetVersion: typeof LEAD_SCORING_RULESET;
  totalScore: number;
  scoreBand: LeadScoreBand;
  summary: string;
  components: LeadScoreComponent[];
}

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meaningfulTokens(value: string): string[] {
  const genericRoleWords = [
    "and", "the", "for", "with", "specialist", "manager", "representative",
    "coordinator", "assistant", "executive", "officer",
  ];
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 2 && !genericRoleWords.includes(token));
}

function includesPhrase(haystack: string, needle: string): boolean {
  const normalizedNeedle = normalize(needle);
  return Boolean(normalizedNeedle)
    && ` ${normalize(haystack)} `.includes(` ${normalizedNeedle} `);
}

function daysBetween(earlier: string, later: Date): number | null {
  const parsed = new Date(earlier);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((later.getTime() - parsed.getTime()) / 86_400_000);
}

function daysUntil(later: string, now: Date): number | null {
  const parsed = new Date(later);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.ceil((parsed.getTime() - now.getTime()) / 86_400_000);
}

function boundedConfidence(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function targetRoleComponent(
  job: LeadScoringJobInput,
  profile: LeadScoringProfileInput,
): LeadScoreComponent {
  const title = normalize(job.title);
  const titleWords = new Set(title.split(" "));
  const combined = `${job.title} ${job.description}`;
  let best: { target: string; points: number; strength: string } | null = null;

  for (const target of profile.targetRoles) {
    const normalizedTarget = normalize(target);
    if (!normalizedTarget) continue;
    const tokens = meaningfulTokens(target);
    let points = 0;
    let strength = "";
    if (includesPhrase(job.title, target)) {
      points = 25;
      strength = "appears directly in the title";
    } else if (tokens.length && tokens.every((token) => titleWords.has(token))) {
      points = 22;
      strength = "all significant role terms appear in the title";
    } else if (tokens.some((token) => titleWords.has(token))) {
      points = 16;
      strength = "a target role term appears in the title";
    } else if (includesPhrase(combined, target)) {
      points = 8;
      strength = "appears in the advertisement body";
    }
    if (!best || points > best.points) best = { target, points, strength };
  }

  const points = best?.points ?? 0;
  return {
    component: "target_role",
    points,
    maxPoints: LEAD_SCORE_MAX_POINTS.target_role,
    reason: best && points > 0
      ? `Target role “${best.target}” ${best.strength}.`
      : profile.targetRoles.length
        ? "No configured target role matched the title or advertisement."
        : "No target roles are configured.",
    inputs: {
      title: job.title,
      configured_targets: profile.targetRoles,
      matched_target: points > 0 ? best?.target ?? null : null,
    },
    summaryFragment: points >= 22
      ? "strong role match"
      : points >= 16
        ? "partial role match"
        : null,
  };
}

function targetGeographyComponent(
  job: LeadScoringJobInput,
  profile: LeadScoringProfileInput,
): LeadScoreComponent {
  const matched = job.location
    ? profile.targetGeographies.find((target) => includesPhrase(job.location ?? "", target))
    : undefined;
  let points = 0;
  let reason = "No configured target geography matched the advertisement location.";
  let summaryFragment: string | null = null;
  if (matched) {
    points = 15;
    reason = `Advertisement location “${job.location}” matches target geography “${matched}”.`;
    summaryFragment = `${matched} target geography`;
  } else if (job.remoteType === "remote" && profile.targetGeographies.length > 0) {
    points = 10;
    reason = "The role is remote and can be considered across the configured target geographies.";
    summaryFragment = "remote geography compatible";
  } else if (!profile.targetGeographies.length) {
    reason = "No target geographies are configured.";
  } else if (!job.location) {
    reason = "The advertisement has no verified location.";
  }
  return {
    component: "target_geography",
    points,
    maxPoints: LEAD_SCORE_MAX_POINTS.target_geography,
    reason,
    inputs: {
      location: job.location,
      remote_type: job.remoteType,
      configured_targets: profile.targetGeographies,
      matched_target: matched ?? null,
    },
    summaryFragment,
  };
}

function advertisementRecencyComponent(
  job: LeadScoringJobInput,
  now: Date,
): LeadScoreComponent {
  const ageDays = job.postedAt ? daysBetween(job.postedAt, now) : null;
  let points = 0;
  let reason = "The advertisement does not have a verified posting date.";
  let summaryFragment: string | null = null;
  if (ageDays !== null) {
    if (ageDays < 0) points = 0;
    else if (ageDays <= 7) points = 15;
    else if (ageDays <= 14) points = 12;
    else if (ageDays <= 30) points = 8;
    else if (ageDays <= 60) points = 4;
    reason = ageDays < 0
      ? "The posting date is in the future, so no recency points were awarded."
      : `Advertisement was posted ${ageDays} day${ageDays === 1 ? "" : "s"} ago.`;
    if (ageDays >= 0 && ageDays <= 14) summaryFragment = "recent advertisement";
  }
  return {
    component: "advertisement_recency",
    points,
    maxPoints: LEAD_SCORE_MAX_POINTS.advertisement_recency,
    reason,
    inputs: { posted_at: job.postedAt, age_days: ageDays },
    summaryFragment,
  };
}

const URGENCY_PHRASES = [
  "urgent",
  "immediate start",
  "start immediately",
  "as soon as possible",
  "asap",
  "hiring now",
  "multiple positions",
  "multiple roles",
  "several positions",
];

function hiringUrgencyComponent(job: LeadScoringJobInput, now: Date): LeadScoreComponent {
  const advertisement = normalize(
    `${job.title} ${job.description} ${job.responsibilities.join(" ")}`,
  );
  const matchedPhrases = URGENCY_PHRASES.filter((phrase) => includesPhrase(advertisement, phrase));
  const expiryDays = job.expiresAt ? daysUntil(job.expiresAt, now) : null;
  const expiryPoints = expiryDays !== null && expiryDays >= 0 && expiryDays <= 7
    ? 8
    : expiryDays !== null && expiryDays >= 0 && expiryDays <= 14
      ? 5
      : 0;
  const phrasePoints = matchedPhrases.length >= 2 ? 7 : matchedPhrases.length === 1 ? 5 : 0;
  const points = Math.min(15, expiryPoints + phrasePoints);
  const reasons: string[] = [];
  if (expiryPoints) reasons.push(`application closes in ${expiryDays} day${expiryDays === 1 ? "" : "s"}`);
  if (matchedPhrases.length) reasons.push(`urgency language: ${matchedPhrases.join(", ")}`);
  return {
    component: "hiring_urgency",
    points,
    maxPoints: LEAD_SCORE_MAX_POINTS.hiring_urgency,
    reason: reasons.length
      ? `Hiring urgency supported by ${reasons.join(" and ")}.`
      : "No verified deadline or urgency language indicates accelerated hiring.",
    inputs: {
      expires_at: job.expiresAt,
      days_until_expiry: expiryDays,
      matched_urgency_phrases: matchedPhrases,
    },
    summaryFragment: points >= 10 ? "strong hiring urgency" : points >= 5 ? "some hiring urgency" : null,
  };
}

function companyEvidenceCoverage(evidence: Record<string, unknown>): number {
  const covered = ["name", "industry", "location", "services", "description"]
    .filter((field) => evidence[field] !== undefined).length;
  return covered / 5;
}

function companyFitComponent(
  company: LeadScoringCompanyInput,
  profile: LeadScoringProfileInput,
): LeadScoreComponent {
  let points = company.domain ? 3 : 0;
  const matchedIndustry = company.industry
    ? profile.preferredIndustries.find((industry) => includesPhrase(company.industry ?? "", industry))
    : undefined;
  if (matchedIndustry) points += 4;
  const companyText = [
    company.industry ?? "",
    company.location ?? "",
    company.services.join(" "),
    company.description ?? "",
  ].join(" ");
  const matchedKeywords = profile.companyFitKeywords
    .filter((keyword) => includesPhrase(companyText, keyword))
    .slice(0, 10);
  if (matchedKeywords.length) points += 3;
  points = Math.min(10, points);

  const reasons = [
    company.domain ? `company domain ${company.domain} is verified` : null,
    matchedIndustry ? `industry matches “${matchedIndustry}”` : null,
    matchedKeywords.length ? `company-fit terms matched: ${matchedKeywords.join(", ")}` : null,
  ].filter((value): value is string => Boolean(value));
  if (!profile.preferredIndustries.length && !profile.companyFitKeywords.length) {
    reasons.push("no preferred industries or fit keywords are configured");
  }
  return {
    component: "company_fit",
    points,
    maxPoints: LEAD_SCORE_MAX_POINTS.company_fit,
    reason: reasons.length ? `${reasons.join("; ")}.` : "No company-fit evidence matched.",
    inputs: {
      domain: company.domain,
      industry: company.industry,
      configured_industries: profile.preferredIndustries,
      configured_keywords: profile.companyFitKeywords,
      matched_industry: matchedIndustry ?? null,
      matched_keywords: matchedKeywords,
    },
    summaryFragment: company.domain ? "company domain verified" : null,
  };
}

const REMOTE_CAPABLE_ROLE_TERMS = [
  "sales", "marketing", "seo", "content", "copywriter", "designer", "video",
  "assistant", "admin", "operations", "project manager", "customer support",
  "data entry", "crm", "advertising", "social media", "account manager",
];

function outsourcingSuitabilityComponent(job: LeadScoringJobInput): LeadScoreComponent {
  let points = job.remoteType === "remote" ? 4 : job.remoteType === "hybrid" ? 2 : 0;
  const employment = normalize(job.employmentType ?? "");
  const flexibleEmployment = ["contract", "casual", "part time", "part-time", "temporary"]
    .find((term) => employment.includes(normalize(term)));
  if (flexibleEmployment) points += 2;
  else if (employment.includes("full time")) points += 1;
  const matchedRoleTerms = REMOTE_CAPABLE_ROLE_TERMS
    .filter((term) => includesPhrase(job.title, term))
    .slice(0, 5);
  if (matchedRoleTerms.length) points += 4;
  points = Math.min(10, points);

  const reasons = [
    job.remoteType === "remote"
      ? "advertisement is remote"
      : job.remoteType === "hybrid"
        ? "advertisement is hybrid"
        : null,
    flexibleEmployment ? `employment type includes ${flexibleEmployment}` : null,
    matchedRoleTerms.length ? `role is digitally deliverable (${matchedRoleTerms.join(", ")})` : null,
  ].filter((value): value is string => Boolean(value));
  return {
    component: "outsourcing_suitability",
    points,
    maxPoints: LEAD_SCORE_MAX_POINTS.outsourcing_suitability,
    reason: reasons.length
      ? `${reasons.join("; ")}.`
      : "No remote-work, flexible-employment, or digitally deliverable role signal matched.",
    inputs: {
      remote_type: job.remoteType,
      employment_type: job.employmentType,
      matched_role_terms: matchedRoleTerms,
    },
    summaryFragment: points >= 8 ? "strong outsourcing suitability" : null,
  };
}

function dataCompletenessComponent(
  job: LeadScoringJobInput,
  company: LeadScoringCompanyInput,
): LeadScoreComponent {
  const jobFields = [
    Boolean(job.title),
    Boolean(job.companyName),
    Boolean(job.location),
    Boolean(job.postedAt),
    job.description.length >= 80,
    job.skills.length > 0,
  ];
  const completeJobFields = jobFields.filter(Boolean).length;
  const jobCompletenessPoints = (completeJobFields / jobFields.length) * 3;
  const confidencePoints = boundedConfidence(job.extractionConfidence) * 3;
  const evidenceCoverage = companyEvidenceCoverage(company.evidence);
  const companyEvidencePoints = evidenceCoverage * 4;
  const points = Math.min(
    10,
    Math.round(jobCompletenessPoints + confidencePoints + companyEvidencePoints),
  );
  return {
    component: "data_completeness_confidence",
    points,
    maxPoints: LEAD_SCORE_MAX_POINTS.data_completeness_confidence,
    reason:
      `${completeJobFields}/6 key job fields present, `
      + `${Math.round(boundedConfidence(job.extractionConfidence) * 100)}% extraction confidence, `
      + `${Math.round(evidenceCoverage * 100)}% company evidence coverage.`,
    inputs: {
      complete_job_fields: completeJobFields,
      total_job_fields: jobFields.length,
      extraction_confidence: boundedConfidence(job.extractionConfidence),
      company_evidence_coverage: evidenceCoverage,
    },
    summaryFragment: points >= 8 ? "complete, high-confidence data" : null,
  };
}

export function calculateLeadScore(
  job: LeadScoringJobInput,
  company: LeadScoringCompanyInput,
  profile: LeadScoringProfileInput,
  now = new Date(),
): CalculatedLeadScore {
  const components = [
    targetRoleComponent(job, profile),
    targetGeographyComponent(job, profile),
    advertisementRecencyComponent(job, now),
    hiringUrgencyComponent(job, now),
    companyFitComponent(company, profile),
    outsourcingSuitabilityComponent(job),
    dataCompletenessComponent(job, company),
  ];
  const totalScore = components.reduce((sum, component) => sum + component.points, 0);
  const scoreBand: LeadScoreBand = totalScore >= 75 ? "high" : totalScore >= 50 ? "medium" : "low";
  const fragments = components
    .filter((component) => component.summaryFragment)
    .sort(
      (left, right) =>
        (right.points / right.maxPoints) - (left.points / left.maxPoints),
    )
    .slice(0, 5)
    .map((component) => component.summaryFragment as string);
  const summary = fragments.length
    ? `${fragments[0][0].toUpperCase()}${fragments[0].slice(1)}${fragments.length > 1 ? `; ${fragments.slice(1).join("; ")}` : ""}.`
    : "No strong target, recency, urgency, fit, or outsourcing signals matched.";
  return {
    rulesetVersion: LEAD_SCORING_RULESET,
    totalScore,
    scoreBand,
    summary,
    components,
  };
}
