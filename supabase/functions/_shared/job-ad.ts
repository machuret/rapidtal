export type RemoteType = "onsite" | "hybrid" | "remote" | "unknown";
export type ExtractionMethod = "json_ld" | "ai" | "json_ld+ai";

export interface JobAdExtraction {
  is_job_ad: boolean;
  source_job_id: string | null;
  title: string | null;
  company_name: string | null;
  company_website: string | null;
  location: string | null;
  remote_type: RemoteType;
  employment_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: string | null;
  description: string | null;
  responsibilities: string[];
  skills: string[];
  posted_at: string | null;
  expires_at: string | null;
  apply_url: string | null;
  field_evidence: Record<string, string>;
  confidence: number;
}

const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
]);

const SENSITIVE_PARAM_PATTERN = /(?:^|_)(?:access_?token|api_?key|auth|code|credential|jwt|key|secret|signature|signed|token)(?:$|_)/i;

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

const TEXT_LIMITS = {
  source_job_id: 300,
  title: 300,
  company_name: 300,
  company_website: 2048,
  location: 500,
  employment_type: 100,
  salary_currency: 10,
  salary_period: 50,
  description: 100_000,
  apply_url: 2048,
} as const;

export function canonicalizePublicJobUrl(raw: unknown): {
  canonicalUrl: string;
  fetchUrl: string;
  hostname: string;
} | null {
  if (typeof raw !== "string" || raw.length > 2048) return null;

  try {
    const parsed = new URL(raw.trim());
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");
    const isIpv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);
    const isIpv6 = hostname.startsWith("[") || hostname.includes(":");

    if (
      parsed.protocol !== "https:"
      || parsed.username
      || parsed.password
      || !hostname.includes(".")
      || isIpv4
      || isIpv6
      || PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(hostname))
    ) {
      return null;
    }

    parsed.hostname = hostname;
    parsed.hash = "";
    const fetchUrl = parsed.toString();
    for (const key of [...parsed.searchParams.keys()]) {
      const normalizedKey = key.toLowerCase();
      if (
        normalizedKey.startsWith("utm_")
        || TRACKING_PARAMS.has(normalizedKey)
        || SENSITIVE_PARAM_PATTERN.test(normalizedKey)
      ) {
        parsed.searchParams.delete(key);
      }
    }
    parsed.searchParams.sort();

    return { canonicalUrl: parsed.toString(), fetchUrl, hostname };
  } catch {
    return null;
  }
}

function cleanText(value: unknown, maxLength = 10_000): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const text = String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.slice(0, maxLength) : null;
}

function cleanList(value: unknown, limit = 50): string[] {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\n|;|,\s+(?=[A-Z])/)
      : [];

  return [...new Set(
    source
      .map((item) => cleanText(item, 500))
      .filter((item): item is string => Boolean(item)),
  )].slice(0, limit);
}

function isoDate(value: unknown): string | null {
  const text = cleanText(value, 100);
  if (!text) return null;
  const timestamp = Date.parse(text);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function finiteNumber(value: unknown): number | null {
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function safePublicUrl(value: unknown): string | null {
  const parsed = canonicalizePublicJobUrl(value);
  return parsed?.canonicalUrl ?? null;
}

function objectValue(value: unknown, keys: string[]): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return null;
}

function organizationName(value: unknown): string | null {
  if (typeof value === "string") return cleanText(value, TEXT_LIMITS.company_name);
  return cleanText(objectValue(value, ["name", "legalName"]), TEXT_LIMITS.company_name);
}

function organizationUrl(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return safePublicUrl(objectValue(value, ["sameAs", "url"]));
}

function addressText(value: unknown): string | null {
  const locations = Array.isArray(value) ? value : value ? [value] : [];
  const rendered = locations.map((location) => {
    if (typeof location === "string") return cleanText(location, 500);
    const address = objectValue(location, ["address"]) ?? location;
    if (typeof address === "string") return cleanText(address, 500);
    if (!address || typeof address !== "object" || Array.isArray(address)) return null;
    const record = address as Record<string, unknown>;
    return [
      record.streetAddress,
      record.addressLocality,
      record.addressRegion,
      record.postalCode,
      record.addressCountry,
    ]
      .map((part) => cleanText(part, 150))
      .filter(Boolean)
      .join(", ");
  }).filter(Boolean);
  return rendered.length ? [...new Set(rendered)].join(" · ").slice(0, 500) : null;
}

function remoteType(value: unknown, location: string | null): RemoteType {
  const text = `${cleanText(value, 100) ?? ""} ${location ?? ""}`.toLowerCase();
  if (text.includes("hybrid")) return "hybrid";
  if (text.includes("telecommute") || text.includes("remote")) return "remote";
  if (location) return "onsite";
  return "unknown";
}

function salaryDetails(value: unknown): Pick<
  JobAdExtraction,
  "salary_min" | "salary_max" | "salary_currency" | "salary_period"
> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { salary_min: null, salary_max: null, salary_currency: null, salary_period: null };
  }
  const record = value as Record<string, unknown>;
  const quantitative = record.value && typeof record.value === "object" && !Array.isArray(record.value)
    ? record.value as Record<string, unknown>
    : record;
  const exact = finiteNumber(quantitative.value);
  const min = finiteNumber(quantitative.minValue) ?? exact;
  const max = finiteNumber(quantitative.maxValue) ?? exact;

  return {
    salary_min: min,
    salary_max: max,
    salary_currency: cleanText(record.currency, TEXT_LIMITS.salary_currency)?.toUpperCase() ?? null,
    salary_period: cleanText(
      quantitative.unitText ?? quantitative.unitCode,
      TEXT_LIMITS.salary_period,
    )?.toLowerCase() ?? null,
  };
}

function sourceIdentifier(value: unknown): string | null {
  if (typeof value === "string" || typeof value === "number") {
    return cleanText(value, TEXT_LIMITS.source_job_id);
  }
  return cleanText(objectValue(value, ["value", "name"]), TEXT_LIMITS.source_job_id);
}

function containsJobPostingType(value: unknown): boolean {
  const types = Array.isArray(value) ? value : [value];
  return types.some((type) =>
    typeof type === "string" && type.toLowerCase() === "jobposting"
  );
}

function findJobPostings(value: unknown, found: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      findJobPostings(item, found);
    }
    return found;
  }
  if (!value || typeof value !== "object") return found;

  const record = value as Record<string, unknown>;
  if (containsJobPostingType(record["@type"])) {
    found.push(record);
    return found;
  }

  for (const child of Object.values(record)) {
    findJobPostings(child, found);
  }
  return found;
}

export function calculateExtractionConfidence(
  extraction: Pick<
    JobAdExtraction,
    "title" | "company_name" | "description" | "location" | "posted_at"
      | "employment_type" | "apply_url"
  >,
): number {
  let score = 0;
  if (extraction.title) score += 0.22;
  if (extraction.company_name) score += 0.22;
  if (extraction.description && extraction.description.length >= 100) score += 0.24;
  if (extraction.location) score += 0.1;
  if (extraction.posted_at) score += 0.08;
  if (extraction.employment_type) score += 0.06;
  if (extraction.apply_url) score += 0.08;
  return Math.round(Math.min(score, 1) * 1000) / 1000;
}

function emptyExtraction(): JobAdExtraction {
  return {
    is_job_ad: false,
    source_job_id: null,
    title: null,
    company_name: null,
    company_website: null,
    location: null,
    remote_type: "unknown",
    employment_type: null,
    salary_min: null,
    salary_max: null,
    salary_currency: null,
    salary_period: null,
    description: null,
    responsibilities: [],
    skills: [],
    posted_at: null,
    expires_at: null,
    apply_url: null,
    field_evidence: {},
    confidence: 0,
  };
}

export function parseJobPostingJsonLd(
  html: unknown,
  expectedUrl?: string,
): JobAdExtraction | null {
  if (typeof html !== "string" || !html.trim()) return null;
  const boundedHtml = html.slice(0, 2_000_000);
  const scripts = boundedHtml.matchAll(
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json(?:;\s*charset=[^"']+)?["'][^>]*>([\s\S]*?)<\/script>/gi,
  );

  const candidates: Record<string, unknown>[] = [];
  for (const match of scripts) {
    try {
      const parsed: unknown = JSON.parse(match[1].trim());
      findJobPostings(parsed, candidates);
    } catch {
      // Ignore malformed JSON-LD blocks and continue looking for a valid one.
    }
  }

  if (candidates.length === 0) return null;
  let job: Record<string, unknown> | undefined;
  if (expectedUrl) {
    const expected = canonicalizePublicJobUrl(expectedUrl)?.canonicalUrl;
    job = candidates.find((candidate) => {
      const candidateUrl = safePublicUrl(candidate.url);
      return Boolean(expected && candidateUrl === expected);
    });
  }
  if (!job && candidates.length === 1) job = candidates[0];
  if (!job) return null;

  const location = addressText(job.jobLocation)
    ?? addressText(job.applicantLocationRequirements);
  const salary = salaryDetails(job.baseSalary ?? job.estimatedSalary);
  const description = cleanText(job.description, TEXT_LIMITS.description);
  const title = cleanText(job.title, TEXT_LIMITS.title);
  const companyName = organizationName(job.hiringOrganization);
  const applyUrl = safePublicUrl(job.url);
  const extraction: JobAdExtraction = {
    ...emptyExtraction(),
    is_job_ad: true,
    source_job_id: sourceIdentifier(job.identifier),
    title,
    company_name: companyName,
    company_website: organizationUrl(job.hiringOrganization),
    location,
    remote_type: remoteType(job.jobLocationType, location),
    employment_type: cleanList(job.employmentType, 10).join(", ") || null,
    ...salary,
    description,
    responsibilities: cleanList(job.responsibilities),
    skills: cleanList(job.skills ?? job.qualifications),
    posted_at: isoDate(job.datePosted),
    expires_at: isoDate(job.validThrough),
    apply_url: applyUrl,
    field_evidence: {
      ...(title ? { title } : {}),
      ...(companyName ? { company_name: companyName } : {}),
      ...(location ? { location } : {}),
      ...(description ? { description: description.slice(0, 500) } : {}),
    },
    confidence: 0,
  };
  extraction.confidence = calculateExtractionConfidence(extraction);
  return extraction;
}

export function normalizeAiExtraction(value: unknown): JobAdExtraction {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("AI extraction is not an object.");
  }
  const record = value as Record<string, unknown>;
  const location = cleanText(record.location, TEXT_LIMITS.location);
  const requestedRemoteType = cleanText(record.remote_type, 20)?.toLowerCase();
  const normalizedRemoteType: RemoteType =
    requestedRemoteType === "onsite"
    || requestedRemoteType === "hybrid"
    || requestedRemoteType === "remote"
    || requestedRemoteType === "unknown"
      ? requestedRemoteType
      : remoteType(requestedRemoteType, location);

  const evidence: Record<string, string> = {};
  if (record.field_evidence && typeof record.field_evidence === "object" && !Array.isArray(record.field_evidence)) {
    for (const [key, item] of Object.entries(record.field_evidence as Record<string, unknown>)) {
      const text = cleanText(item, 500);
      if (text) evidence[key.slice(0, 100)] = text;
    }
  }

  const extraction: JobAdExtraction = {
    is_job_ad: record.is_job_ad === true,
    source_job_id: cleanText(record.source_job_id, TEXT_LIMITS.source_job_id),
    title: cleanText(record.title, TEXT_LIMITS.title),
    company_name: cleanText(record.company_name, TEXT_LIMITS.company_name),
    company_website: safePublicUrl(record.company_website),
    location,
    remote_type: normalizedRemoteType,
    employment_type: cleanText(record.employment_type, TEXT_LIMITS.employment_type),
    salary_min: finiteNumber(record.salary_min),
    salary_max: finiteNumber(record.salary_max),
    salary_currency: cleanText(record.salary_currency, TEXT_LIMITS.salary_currency)?.toUpperCase() ?? null,
    salary_period: cleanText(record.salary_period, TEXT_LIMITS.salary_period)?.toLowerCase() ?? null,
    description: cleanText(record.description, TEXT_LIMITS.description),
    responsibilities: cleanList(record.responsibilities),
    skills: cleanList(record.skills),
    posted_at: isoDate(record.posted_at),
    expires_at: isoDate(record.expires_at),
    apply_url: safePublicUrl(record.apply_url),
    field_evidence: evidence,
    confidence: 0,
  };
  extraction.confidence = calculateExtractionConfidence(extraction);
  return extraction;
}

export function mergeJobExtractions(
  structured: JobAdExtraction | null,
  ai: JobAdExtraction | null,
): { data: JobAdExtraction; method: ExtractionMethod } {
  if (!structured && !ai) throw new Error("No extraction data.");
  if (!structured) return { data: ai!, method: "ai" };
  if (!ai) return { data: structured, method: "json_ld" };

  const merged: JobAdExtraction = {
    is_job_ad: structured.is_job_ad || ai.is_job_ad,
    source_job_id: structured.source_job_id ?? ai.source_job_id,
    title: structured.title ?? ai.title,
    company_name: structured.company_name ?? ai.company_name,
    company_website: structured.company_website ?? ai.company_website,
    location: structured.location ?? ai.location,
    remote_type: structured.remote_type !== "unknown"
      ? structured.remote_type
      : ai.remote_type,
    employment_type: structured.employment_type ?? ai.employment_type,
    salary_min: structured.salary_min ?? ai.salary_min,
    salary_max: structured.salary_max ?? ai.salary_max,
    salary_currency: structured.salary_currency ?? ai.salary_currency,
    salary_period: structured.salary_period ?? ai.salary_period,
    description: structured.description ?? ai.description,
    responsibilities: [...new Set([...structured.responsibilities, ...ai.responsibilities])].slice(0, 50),
    skills: [...new Set([...structured.skills, ...ai.skills])].slice(0, 50),
    posted_at: structured.posted_at ?? ai.posted_at,
    expires_at: structured.expires_at ?? ai.expires_at,
    apply_url: structured.apply_url ?? ai.apply_url,
    field_evidence: { ...ai.field_evidence, ...structured.field_evidence },
    confidence: 0,
  };
  merged.confidence = calculateExtractionConfidence(merged);
  return { data: merged, method: "json_ld+ai" };
}

export function validateJobExtraction(extraction: JobAdExtraction): string | null {
  if (!extraction.is_job_ad) return "The supplied page does not appear to be a job advertisement.";
  if (!extraction.title) return "The job title could not be extracted.";
  if (!extraction.description || extraction.description.length < 80) {
    return "The job description is missing or too short.";
  }
  if (
    extraction.salary_min !== null
    && extraction.salary_max !== null
    && extraction.salary_min > extraction.salary_max
  ) {
    return "The extracted salary range is invalid.";
  }
  if (
    extraction.posted_at
    && extraction.expires_at
    && Date.parse(extraction.posted_at) > Date.parse(extraction.expires_at)
  ) {
    return "The extracted job dates are inconsistent.";
  }
  return null;
}

export function determineReviewStatus(input: {
  existingStatus: string | null;
  currentContentHash: string;
  currentExtractionHash: string;
  previousContentHash: string | null;
  previousExtractionHash: string | null;
  reviewedContentHash: string | null;
  reviewedExtractionHash: string | null;
}): "needs_review" | "approved" | "rejected" | "expired" {
  const {
    existingStatus,
    currentContentHash,
    currentExtractionHash,
    previousContentHash,
    previousExtractionHash,
    reviewedContentHash,
    reviewedExtractionHash,
  } = input;

  if (existingStatus === "approved" || existingStatus === "rejected") {
    return reviewedContentHash === currentContentHash
        && reviewedExtractionHash === currentExtractionHash
      ? existingStatus
      : "needs_review";
  }

  if (existingStatus === "expired") {
    return previousContentHash === currentContentHash
        && previousExtractionHash === currentExtractionHash
      ? "expired"
      : "needs_review";
  }

  return "needs_review";
}
