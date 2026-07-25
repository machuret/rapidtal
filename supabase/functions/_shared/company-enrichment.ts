export const COMPANY_FIELDS = [
  "name",
  "industry",
  "location",
  "services",
  "description",
] as const;

export type CompanyField = typeof COMPANY_FIELDS[number];
export type CompanyFactType = "source_backed" | "inferred";

export interface CompanyPage {
  url: string;
  markdown: string;
}

export interface CompanyFact {
  field_name: CompanyField;
  value: string | string[];
  fact_type: CompanyFactType;
  source_url: string | null;
  source_excerpt: string | null;
  rationale: string | null;
  confidence: number;
}

export interface NormalizedCompanyExtraction {
  sourceBacked: {
    name: string | null;
    industry: string | null;
    location: string | null;
    services: string[];
    description: string | null;
  };
  inferredData: Record<string, string | string[]>;
  evidence: Record<string, unknown>;
  facts: CompanyFact[];
}

const BLOCKED_COMPANY_HOSTS = [
  /(^|\.)seek\.com\.au$/i,
  /(^|\.)indeed\.com$/i,
  /(^|\.)linkedin\.com$/i,
  /(^|\.)greenhouse\.io$/i,
  /(^|\.)lever\.co$/i,
  /(^|\.)myworkdayjobs\.com$/i,
  /(^|\.)workdayjobs\.com$/i,
  /(^|\.)smartrecruiters\.com$/i,
  /(^|\.)workable\.com$/i,
  /(^|\.)ashbyhq\.com$/i,
  /(^|\.)jobvite\.com$/i,
  /(^|\.)facebook\.com$/i,
  /(^|\.)instagram\.com$/i,
  /(^|\.)x\.com$/i,
  /(^|\.)twitter\.com$/i,
  /(^|\.)youtube\.com$/i,
  /(^|\.)crunchbase\.com$/i,
  /(^|\.)glassdoor\.(com|com\.au)$/i,
  /(^|\.)yellowpages\.com\.au$/i,
  /(^|\.)yelp\.(com|com\.au)$/i,
];

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /\.localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /^0\./,
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^::1$/i,
  /^f[cd][0-9a-f]{2}:/i,
  /^fe80:/i,
];

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function text(value: unknown, limit: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, limit) : null;
}

function confidence(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
}

export function parseOfficialCompanyUrl(value: unknown): {
  domain: string;
  websiteUrl: string;
  hostname: string;
} | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const parsed = new URL(value.trim());
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");
    if (
      parsed.protocol !== "https:"
      || parsed.username
      || parsed.password
      || !hostname.includes(".")
      || hostname.includes(":")
      || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)
      || PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(hostname))
      || BLOCKED_COMPANY_HOSTS.some((pattern) => pattern.test(hostname))
    ) {
      return null;
    }
    const domain = hostname.replace(/^www\./, "");
    return {
      domain,
      hostname,
      websiteUrl: `https://${hostname}/`,
    };
  } catch {
    return null;
  }
}

function sameCompanyHost(hostname: string, domain: string): boolean {
  const normalized = hostname.toLowerCase().replace(/^www\./, "");
  return normalized === domain;
}

export function buildCompanyCrawlerInput(websiteUrl: string): Record<string, unknown> {
  const origin = new URL(websiteUrl).origin;
  const usefulPaths = [
    "about",
    "about-us",
    "company",
    "services",
    "what-we-do",
    "contact",
    "contact-us",
  ];
  return {
    startUrls: [{ url: `${origin}/` }],
    includeUrlGlobs: usefulPaths.flatMap((path) => [
      { glob: `${origin}/${path}` },
      { glob: `${origin}/${path}/**` },
    ]),
    crawlerType: "playwright:adaptive",
    maxCrawlPages: 4,
    maxCrawlDepth: 1,
    useSitemaps: false,
    useLlmsTxt: false,
    dynamicContentWaitSecs: 3,
    maxScrollHeightPixels: 8_000,
    removeCookieWarnings: true,
    blockMedia: true,
    htmlTransformer: "none",
    removeElementsCssSelector:
      "nav, footer, style, noscript, svg, img[src^='data:'], [role='dialog'], [aria-modal='true']",
    saveMarkdown: true,
    saveHtml: false,
    saveHtmlAsFile: false,
    storeSkippedUrls: false,
  };
}

export function parseCompanyDataset(value: unknown, domain: string): CompanyPage[] {
  if (!Array.isArray(value)) return [];
  const pages: CompanyPage[] = [];
  const seen = new Set<string>();

  for (const raw of value.slice(0, 10)) {
    const item = record(raw);
    if (!item) continue;
    const rawUrl = [item.loadedUrl, item.url, item.requestedUrl]
      .find((candidate) => typeof candidate === "string");
    const markdown = [item.markdown, item.text, item.content]
      .find((candidate) => typeof candidate === "string");
    if (typeof rawUrl !== "string" || typeof markdown !== "string") continue;
    try {
      const parsed = new URL(rawUrl);
      parsed.hash = "";
      if (
        parsed.protocol !== "https:"
        || !sameCompanyHost(parsed.hostname, domain)
        || markdown.trim().length < 80
      ) {
        continue;
      }
      const canonicalUrl = parsed.toString();
      if (seen.has(canonicalUrl)) continue;
      seen.add(canonicalUrl);
      pages.push({
        url: canonicalUrl,
        markdown: markdown.trim().slice(0, 30_000),
      });
    } catch {
      continue;
    }
  }
  return pages.slice(0, 4);
}

export function normalizeCompanyExtraction(
  raw: unknown,
  sourcePages: Map<string, string>,
): NormalizedCompanyExtraction {
  const root = record(raw);
  const backed = record(root?.source_backed) ?? {};
  const inferred = Array.isArray(root?.inferred) ? root.inferred : [];
  const facts: CompanyFact[] = [];
  const evidence: Record<string, unknown> = {};

  const scalarLimits: Record<Exclude<CompanyField, "services">, number> = {
    name: 300,
    industry: 200,
    location: 500,
    description: 2_000,
  };
  const sourceBacked: NormalizedCompanyExtraction["sourceBacked"] = {
    name: null,
    industry: null,
    location: null,
    services: [],
    description: null,
  };

  for (const field of ["name", "industry", "location", "description"] as const) {
    const item = record(backed[field]);
    const value = text(item?.value, scalarLimits[field]);
    const sourceUrl = text(item?.source_url, 2048);
    const excerpt = text(item?.excerpt, 500);
    if (!value || !sourceUrl || !excerpt || !excerptAppearsOnPage(sourceUrl, excerpt, sourcePages)) continue;
    sourceBacked[field] = value;
    const itemConfidence = confidence(item?.confidence);
    evidence[field] = { source_url: sourceUrl, excerpt, confidence: itemConfidence };
    facts.push({
      field_name: field,
      value,
      fact_type: "source_backed",
      source_url: sourceUrl,
      source_excerpt: excerpt,
      rationale: null,
      confidence: itemConfidence,
    });
  }

  const services = Array.isArray(backed.services) ? backed.services : [];
  const serviceEvidence: Record<string, unknown>[] = [];
  for (const rawService of services.slice(0, 30)) {
    const item = record(rawService);
    const value = text(item?.value, 300);
    const sourceUrl = text(item?.source_url, 2048);
    const excerpt = text(item?.excerpt, 500);
    if (!value || !sourceUrl || !excerpt || !excerptAppearsOnPage(sourceUrl, excerpt, sourcePages)) continue;
    if (sourceBacked.services.includes(value)) continue;
    sourceBacked.services.push(value);
    const itemConfidence = confidence(item?.confidence);
    serviceEvidence.push({ value, source_url: sourceUrl, excerpt, confidence: itemConfidence });
    facts.push({
      field_name: "services",
      value,
      fact_type: "source_backed",
      source_url: sourceUrl,
      source_excerpt: excerpt,
      rationale: null,
      confidence: itemConfidence,
    });
  }
  if (serviceEvidence.length) evidence.services = serviceEvidence;

  const inferredData: Record<string, string | string[]> = {};
  for (const rawInference of inferred.slice(0, 10)) {
    const item = record(rawInference);
    const field = text(item?.field, 50);
    if (!field || !COMPANY_FIELDS.includes(field as CompanyField)) continue;
    const rawValue = item?.value;
    const value = Array.isArray(rawValue)
      ? rawValue.map((entry) => text(entry, 300)).filter((entry): entry is string => Boolean(entry)).slice(0, 30)
      : text(rawValue, field === "description" ? 2_000 : 500);
    const rationale = text(item?.rationale, 1_000);
    if (!value || (Array.isArray(value) && !value.length) || !rationale) continue;
    inferredData[field] = value;
    facts.push({
      field_name: field as CompanyField,
      value,
      fact_type: "inferred",
      source_url: null,
      source_excerpt: null,
      rationale,
      confidence: confidence(item?.confidence),
    });
  }

  return { sourceBacked, inferredData, evidence, facts };
}

function normalizedEvidenceText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("en").replace(/\s+/g, " ").trim();
}

function excerptAppearsOnPage(
  sourceUrl: string,
  excerpt: string,
  sourcePages: Map<string, string>,
): boolean {
  const page = sourcePages.get(sourceUrl);
  if (!page) return false;
  const normalizedExcerpt = normalizedEvidenceText(excerpt);
  return normalizedExcerpt.length >= 8
    && normalizedEvidenceText(page).includes(normalizedExcerpt);
}

const LEGAL_NAME_WORDS = new Set([
  "pty", "ltd", "limited", "inc", "incorporated", "llc", "plc", "corp",
  "corporation", "company", "co", "group", "holdings", "australia", "australian",
]);

function companyNameTokens(value: string): string[] {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 1 && !LEGAL_NAME_WORDS.has(part));
}

export function companyNamesMatch(left: unknown, right: unknown): boolean {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const leftTokens = companyNameTokens(left);
  const rightTokens = companyNameTokens(right);
  if (!leftTokens.length || !rightTokens.length) return false;
  const shorter = leftTokens.length <= rightTokens.length ? leftTokens : rightTokens;
  const longer = new Set(leftTokens.length <= rightTokens.length ? rightTokens : leftTokens);
  return shorter.every((token) => longer.has(token));
}

export interface CompanySearchCandidate {
  domain: string;
  websiteUrl: string;
  url: string;
  title: string;
  description: string;
  position: number;
  score: number;
}

function searchRows(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  const rows: Record<string, unknown>[] = [];
  for (const raw of value.slice(0, 10)) {
    const item = record(raw);
    if (!item) continue;
    if (Array.isArray(item.organicResults)) {
      for (const result of item.organicResults.slice(0, 10)) {
        const resultRecord = record(result);
        if (resultRecord) rows.push(resultRecord);
      }
    } else {
      rows.push(item);
    }
  }
  return rows;
}

function scoreCandidate(
  companyName: string,
  official: NonNullable<ReturnType<typeof parseOfficialCompanyUrl>>,
  title: string,
  description: string,
  position: number,
): number {
  const tokens = companyNameTokens(companyName);
  if (!tokens.length) return 0;
  const domainLabel = official.domain.split(".")[0].replace(/[^a-z0-9]/g, "");
  const compactName = tokens.join("");
  const normalizedTitle = companyNameTokens(title);
  const normalizedDescription = companyNameTokens(description);
  const allInTitle = tokens.every((token) => normalizedTitle.includes(token));
  const allInDescription = tokens.every((token) => normalizedDescription.includes(token));
  let score = 0;
  if (domainLabel === compactName) score += 0.5;
  else if (compactName.length >= 5 && (domainLabel.includes(compactName) || compactName.includes(domainLabel))) score += 0.38;
  if (allInTitle) score += 0.35;
  if (allInDescription) score += 0.1;
  if (position > 0 && position <= 3) score += 0.05;
  return Math.min(1, Number(score.toFixed(2)));
}

export function selectOfficialCompanyCandidate(
  value: unknown,
  companyName: string,
): { selected: CompanySearchCandidate | null; candidates: CompanySearchCandidate[] } {
  const byDomain = new Map<string, CompanySearchCandidate>();
  for (const [index, item] of searchRows(value).entries()) {
    const url = text(item.url, 2048);
    if (!url) continue;
    const official = parseOfficialCompanyUrl(url);
    if (!official) continue;
    const title = text(item.title, 500) ?? "";
    const description = text(item.description, 1_000) ?? "";
    const position = Math.max(1, Number(item.position) || index + 1);
    const candidate: CompanySearchCandidate = {
      ...official,
      url,
      title,
      description,
      position,
      score: scoreCandidate(companyName, official, title, description, position),
    };
    const previous = byDomain.get(candidate.domain);
    if (!previous || candidate.score > previous.score) byDomain.set(candidate.domain, candidate);
  }
  const candidates = [...byDomain.values()]
    .sort((left, right) => right.score - left.score || left.position - right.position)
    .slice(0, 5);
  const top = candidates[0];
  const runnerUp = candidates[1];
  const selected = top && top.score >= 0.7 && (!runnerUp || top.score - runnerUp.score >= 0.15)
    ? top
    : null;
  return { selected, candidates };
}
