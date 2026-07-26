const TRACKING_PARAMETERS = new Set([
  "fbclid",
  "gclid",
  "ref",
  "source",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
]);

export const MAX_JOB_IMPORT_URLS = 25;

export function normalizeJobUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return null;
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMETERS.has(key.toLowerCase())) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
    return url.toString();
  } catch {
    return null;
  }
}

export function parseJobImportText(text: string): {
  urls: string[];
  invalidCount: number;
  repeatedCount: number;
  overflowCount: number;
} {
  const candidates = text
    .split(/[\n,\t;]+/)
    .map((value) => value.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
  const urls: string[] = [];
  const seen = new Set<string>();
  let invalidCount = 0;
  let repeatedCount = 0;

  for (const candidate of candidates) {
    const normalized = normalizeJobUrl(candidate);
    if (!normalized) {
      invalidCount += 1;
    } else if (seen.has(normalized)) {
      repeatedCount += 1;
    } else {
      seen.add(normalized);
      urls.push(normalized);
    }
  }

  return {
    urls: urls.slice(0, MAX_JOB_IMPORT_URLS),
    invalidCount,
    repeatedCount,
    overflowCount: Math.max(0, urls.length - MAX_JOB_IMPORT_URLS),
  };
}
