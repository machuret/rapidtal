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
  return {
    startUrls: [
      { url: `${origin}/` },
      { url: `${origin}/about` },
      { url: `${origin}/services` },
      { url: `${origin}/contact` },
    ],
    crawlerType: "playwright:adaptive",
    maxCrawlPages: 4,
    maxCrawlDepth: 0,
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
    const rawUrl = [item.url, item.loadedUrl, item.requestedUrl]
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
  allowedSourceUrls: Set<string>,
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
    if (!value || !sourceUrl || !excerpt || !allowedSourceUrls.has(sourceUrl)) continue;
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
    if (!value || !sourceUrl || !excerpt || !allowedSourceUrls.has(sourceUrl)) continue;
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
