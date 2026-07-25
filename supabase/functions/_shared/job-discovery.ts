import { canonicalizePublicJobUrl } from "./job-ad.ts";

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
}

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
      maxResults: params.maxResults,
      dateRange: params.dateRangeDays,
      sortBy: "date",
      ...(params.workType ? { workType: [params.workType] } : {}),
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

  const description = firstText(
    (item.content as Record<string, unknown> | undefined)?.unEditedContent,
    item.description,
    item.teaser,
  );

  return {
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
    company_website: firstText(companyProfile?.website, item.companyUrl),
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
