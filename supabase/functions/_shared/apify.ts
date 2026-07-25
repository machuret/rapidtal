export interface ApifyPageContent {
  markdown: string;
  html: string;
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

  const markdownCandidates = [item.markdown, item.text, item.content];
  const htmlCandidates = [item.html, item.rawHtml];
  const markdown = markdownCandidates.find((candidate) => typeof candidate === "string");
  const html = htmlCandidates.find((candidate) => typeof candidate === "string");

  if (typeof markdown !== "string" && typeof html !== "string") return null;
  return {
    markdown: typeof markdown === "string" ? markdown.trim().slice(0, 150_000) : "",
    html: typeof html === "string" ? html.slice(0, 2_000_000) : "",
  };
}
