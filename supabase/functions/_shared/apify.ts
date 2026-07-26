import { canonicalizePublicJobUrl } from "./job-url.ts";

export interface ApifyPageContent {
  markdown: string;
  html: string;
  finalUrl: string | null;
  statusCode: number | null;
  redirectHistory: string[];
}

export interface ApifyRunState {
  id: string;
  status: string;
  defaultDatasetId: string | null;
  usageTotalUsd: number;
}

export function buildApifyWebsiteContentInput(url: string): Record<string, unknown> {
  return {
    startUrls: [{ url }],
    crawlerType: "playwright:adaptive",
    maxCrawlPages: 1,
    maxCrawlDepth: 0,
    useSitemaps: false,
    useLlmsTxt: false,
    dynamicContentWaitSecs: 5,
    maxScrollHeightPixels: 10_000,
    removeCookieWarnings: true,
    blockMedia: true,
    htmlTransformer: "none",
    removeElementsCssSelector:
      "nav, footer, style, noscript, svg, img[src^='data:'], [role='dialog'], [aria-modal='true']",
    saveMarkdown: true,
    saveHtml: true,
    saveHtmlAsFile: false,
    storeSkippedUrls: false,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export function parseApifyRun(value: unknown): ApifyRunState | null {
  const envelope = asRecord(value);
  const run = asRecord(envelope?.data);
  if (!run || typeof run.id !== "string" || typeof run.status !== "string") return null;

  return {
    id: run.id,
    status: run.status,
    defaultDatasetId: typeof run.defaultDatasetId === "string" ? run.defaultDatasetId : null,
    usageTotalUsd: Number.isFinite(Number(run.usageTotalUsd))
      ? Math.max(0, Number(run.usageTotalUsd))
      : 0,
  };
}

export function isApifyRunPending(status: string): boolean {
  return status === "READY" || status === "RUNNING";
}

export function parseApifyDatasetItems(value: unknown): ApifyPageContent | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const item = asRecord(value[0]);
  if (!item) return null;
  const metadata = asRecord(item.metadata);
  const crawl = asRecord(item.crawl);
  const request = asRecord(item.request);

  const markdownCandidates = [item.markdown, item.text, item.content];
  const htmlCandidates = [item.html, item.rawHtml];
  const markdown = markdownCandidates.find((candidate) => typeof candidate === "string");
  const html = htmlCandidates.find((candidate) => typeof candidate === "string");
  const finalUrlValue = [
    item.loadedUrl,
    item.finalUrl,
    crawl?.loadedUrl,
    request?.loadedUrl,
    item.url,
    item.requestedUrl,
    request?.url,
  ].find((candidate) => typeof candidate === "string");
  const finalUrl = canonicalizePublicJobUrl(finalUrlValue)?.canonicalUrl ?? null;
  const numericStatus = [
    item.statusCode,
    item.httpStatusCode,
    item.responseStatusCode,
    metadata?.statusCode,
    crawl?.statusCode,
    crawl?.httpStatusCode,
    request?.statusCode,
  ]
    .map((candidate) => Number(candidate))
    .find((candidate) => Number.isInteger(candidate) && candidate >= 100 && candidate <= 599)
    ?? null;

  const rawRedirects = [
    ...(Array.isArray(item.redirectUrls) ? item.redirectUrls : []),
    ...(Array.isArray(item.redirectChain) ? item.redirectChain : []),
    ...(Array.isArray(crawl?.redirectUrls) ? crawl.redirectUrls : []),
    ...(Array.isArray(crawl?.redirectChain) ? crawl.redirectChain : []),
    item.requestedUrl,
    request?.url,
    request?.loadedUrl,
    finalUrlValue,
  ];
  const redirectHistory = [...new Set(rawRedirects.flatMap((candidate) => {
    const record = asRecord(candidate);
    const urls = typeof candidate === "string"
      ? [candidate]
      : [record?.url, record?.fromUrl, record?.toUrl, record?.loadedUrl];
    return urls.flatMap((raw) => {
      const canonical = canonicalizePublicJobUrl(raw)?.canonicalUrl;
      return canonical ? [canonical] : [];
    });
  }))].slice(0, 20);

  if (typeof markdown !== "string" && typeof html !== "string") return null;
  return {
    markdown: typeof markdown === "string" ? markdown.trim().slice(0, 150_000) : "",
    html: typeof html === "string" ? html.slice(0, 2_000_000) : "",
    finalUrl,
    statusCode: numericStatus,
    redirectHistory,
  };
}
