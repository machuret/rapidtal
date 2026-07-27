import { canonicalizePublicJobUrl } from "./job-url.ts";

export type JobDiscoverySource = "seek" | "indeed" | "linkedin";

export interface DiscoveryParameters {
  searchTerm: string;
  location: string;
  country: string;
  maxResults: number;
  dateRangeDays: number;
  workType: string;
}

export interface NormalizedDiscovery {
  source: JobDiscoverySource;
  source_job_id: string | null;
  job_url: string;
  canonical_url: string;
  title: string;
  company_name: string | null;
  company_website: string | null;
  location: string | null;
  country: string | null;
  salary_text: string | null;
  work_type: string | null;
  work_arrangement: string | null;
  summary: string | null;
  listed_at: string | null;
  expires_at: string | null;
  content_fingerprint: string;
}

export const DISCOVERY_ADAPTERS: Record<JobDiscoverySource, {
  version: string;
  allowedHosts: string[];
  allowedPathPrefixes: string[];
}> = {
  seek: {
    version: "phase6-v1",
    allowedHosts: ["seek.com.au"],
    allowedPathPrefixes: ["/job/"],
  },
  indeed: {
    version: "phase6-v1",
    allowedHosts: ["indeed.com", "indeed.com.au"],
    allowedPathPrefixes: ["/viewjob", "/rc/clk", "/pagead/clk"],
  },
  linkedin: {
    version: "phase6-v1",
    allowedHosts: ["linkedin.com"],
    allowedPathPrefixes: ["/jobs/view/"],
  },
};

const ACCESS_BARRIER_PATTERN =
  /\b(captcha|access denied|authwall|checkpoint|challenge required|login required|log in to continue|sign in to continue|unauthorized)\b/i;
const FORBIDDEN_INPUT_KEY =
  /^(?:auth|authorization|cookie|cookies|credential|jwt|login|password|session|token|username)$/i;

function text(value: unknown, max = 500): string | null {
  if (value === null || value === undefined || value === "N/A") return null;
  const normalized = String(value).replace(/\s+/g, " ").trim();
  return normalized ? normalized.slice(0, max) : null;
}

function firstText(...values: unknown[]): string | null {
  for (const value of values) {
    if (Array.isArray(value)) {
      const joined = value.map((item) => text(item, 120)).filter(Boolean).join(", ");
      if (joined) return joined.slice(0, 500);
    }
    const candidate = text(value);
    if (candidate) return candidate;
  }
  return null;
}

function isoDate(value: unknown): string | null {
  const candidate = text(value, 100);
  if (!candidate) return null;
  const timestamp = Date.parse(candidate);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function allowedHost(hostname: string, allowedHosts: string[]): boolean {
  return allowedHosts.some(
    (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`),
  );
}

function fingerprintText(value: string, seed: number): string {
  let hash = seed >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function discoveryContentFingerprint(
  value: Omit<NormalizedDiscovery, "content_fingerprint">,
): string {
  const serialized = JSON.stringify([
    value.title,
    value.company_name,
    value.location,
    value.salary_text,
    value.work_type,
    value.work_arrangement,
    value.summary,
    value.listed_at,
    value.expires_at,
  ]);
  return `${fingerprintText(serialized, 0x811c9dc5)}${fingerprintText(serialized, 0x9e3779b9)}`;
}

export function discoveryAccessBarrier(value: unknown): string | null {
  const records = Array.isArray(value) ? value : [value];
  for (const record of records.slice(0, 50)) {
    if (!record || typeof record !== "object" || Array.isArray(record)) continue;
    const item = record as Record<string, unknown>;
    for (const key of ["error", "errorMessage", "message", "status", "url", "requestUrl", "finalUrl"]) {
      const candidate = item[key];
      if (typeof candidate === "string") {
        const match = candidate.match(ACCESS_BARRIER_PATTERN);
        if (match) return match[1].toLowerCase().replace(/\s+/g, "_");
      }
    }
  }
  return null;
}

export function isPublicDiscoveryActorInput(value: unknown): boolean {
  if (!value || typeof value !== "object") return true;
  if (Array.isArray(value)) return value.every(isPublicDiscoveryActorInput);
  return Object.entries(value as Record<string, unknown>).every(
    ([key, nested]) => !FORBIDDEN_INPUT_KEY.test(key) && isPublicDiscoveryActorInput(nested),
  );
}

export function isCompleteDiscoverySnapshot(
  value: unknown,
  normalizedCount: number,
  limit: number,
): boolean {
  return Array.isArray(value)
    && value.length < limit
    && value.length === normalizedCount;
}

export function actorForSource(
  source: JobDiscoverySource,
  overrides: Partial<Record<JobDiscoverySource, string>> = {},
): string {
  const defaults: Record<JobDiscoverySource, string> = {
    seek: "websift~seek-job-scraper",
    indeed: "misceres~indeed-scraper",
    linkedin: "artificially~linkedin-jobs-scraper",
  };
  return overrides[source] || defaults[source];
}

export function buildDiscoveryActorInput(
  source: JobDiscoverySource,
  params: DiscoveryParameters,
): Record<string, unknown> {
  if (source === "seek") {
    return {
      searchTerm: params.searchTerm,
      location: params.location || undefined,
      country: params.country === "AU" ? "australia" : undefined,
      maxResults: params.maxResults,
      dateRange: params.dateRangeDays,
      sortBy: "ListedDate",
      ...(params.workType ? { workTypes: [params.workType] } : {}),
    };
  }
  if (source === "indeed") {
    return {
      position: params.searchTerm,
      location: params.location || undefined,
      country: params.country,
      maxItemsPerSearch: params.maxResults,
      saveOnlyUniqueItems: true,
    };
  }
  return {
    searchQueries: [params.searchTerm],
    location: params.location || undefined,
    maxJobs: params.maxResults,
    datePosted: params.dateRangeDays === 1
      ? "past-24h"
      : params.dateRangeDays <= 7
        ? "past-week"
        : "past-month",
    ...(params.workType ? { jobType: [params.workType] } : {}),
  };
}

export function normalizeDiscoveryItem(
  source: JobDiscoverySource,
  item: Record<string, unknown>,
  fallbackCountry: string,
): NormalizedDiscovery | null {
  const locationInfo = item.joblocationInfo as Record<string, unknown> | undefined;
  const advertiser = item.advertiser as Record<string, unknown> | undefined;
  const companyProfile = item.companyProfile as Record<string, unknown> | undefined;

  const url = firstText(item.jobLink, item.jobUrl, item.url, item.link);
  const title = firstText(item.title, item.positionName, item.position);
  if (!url || !title) return null;
  const parsedUrl = canonicalizePublicJobUrl(url);
  if (!parsedUrl) return null;
  const adapter = DISCOVERY_ADAPTERS[source];
  let path = "/";
  try {
    path = new URL(parsedUrl.canonicalUrl).pathname.toLowerCase();
  } catch {
    return null;
  }
  if (
    !allowedHost(parsedUrl.hostname, adapter.allowedHosts)
    || !adapter.allowedPathPrefixes.some((prefix) => path.startsWith(prefix))
    || ACCESS_BARRIER_PATTERN.test(path)
  ) {
    return null;
  }

  const description = firstText(
    (item.content as Record<string, unknown> | undefined)?.unEditedContent,
    item.description,
    item.teaser,
  );

  const companyWebsiteValue = firstText(companyProfile?.website, item.companyUrl);
  const companyWebsite = companyWebsiteValue
    ? canonicalizePublicJobUrl(companyWebsiteValue)?.canonicalUrl ?? null
    : null;
  const normalized: Omit<NormalizedDiscovery, "content_fingerprint"> = {
    source,
    source_job_id: firstText(item.id, item.jobId, item.externalId),
    job_url: parsedUrl.canonicalUrl,
    canonical_url: parsedUrl.canonicalUrl,
    title: title.slice(0, 300),
    company_name: firstText(
      advertiser?.name,
      companyProfile?.name,
      item.company,
      item.companyName,
    ),
    company_website: companyWebsite,
    location: firstText(
      locationInfo?.displayLocation,
      locationInfo?.location,
      item.location,
      item.place,
    ),
    country: firstText(locationInfo?.countryCode, item.country, fallbackCountry),
    salary_text: firstText(item.salary, item.salaryLabel),
    work_type: firstText(item.workTypes, item.jobType, item.contractType, item.type),
    work_arrangement: firstText(item.workArrangements, item.workType),
    summary: description ? description.slice(0, 1000) : null,
    listed_at: isoDate(item.listedAt ?? item.postedAt ?? item.listingDateParsed ?? item.publishedAt),
    expires_at: isoDate(item.expiresAtUtc ?? item.expiresAt),
  };
  return {
    ...normalized,
    content_fingerprint: discoveryContentFingerprint(normalized),
  };
}

export function normalizeDiscoveryDataset(
  source: JobDiscoverySource,
  value: unknown,
  fallbackCountry: string,
  limit: number,
): NormalizedDiscovery[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, NormalizedDiscovery>();
  for (const valueItem of value.slice(0, limit)) {
    if (!valueItem || typeof valueItem !== "object" || Array.isArray(valueItem)) continue;
    const item = normalizeDiscoveryItem(
      source,
      valueItem as Record<string, unknown>,
      fallbackCountry,
    );
    if (item && !unique.has(item.canonical_url)) unique.set(item.canonical_url, item);
  }
  return [...unique.values()];
}
