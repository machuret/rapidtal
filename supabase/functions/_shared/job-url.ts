const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "dclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
]);

const SENSITIVE_PARAM_PATTERN =
  /(?:^|_)(?:access_?token|api_?key|auth|code|credential|jwt|key|secret|signature|signed|token)(?:$|_)/i;

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

export type CanonicalPublicJobUrl = {
  canonicalUrl: string;
  fetchUrl: string;
  hostname: string;
};

export function canonicalizePublicJobUrl(raw: unknown): CanonicalPublicJobUrl | null {
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
