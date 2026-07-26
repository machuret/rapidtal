import { canonicalizePublicJobUrl } from "@/supabase/functions/_shared/job-url";

export const MAX_JOB_IMPORT_URLS = 25;

export function normalizeJobUrl(value: string): string | null {
  return canonicalizePublicJobUrl(value)?.canonicalUrl ?? null;
}

function parseDelimitedRow(row: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < row.length; index += 1) {
    const character = row[index];
    if (character === "\"") {
      if (quoted && row[index + 1] === "\"") {
        current += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === delimiter && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }
  cells.push(current.trim());
  return cells;
}

function candidateCells(text: string): string[] {
  const cells: string[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    // A whole-line URL wins before delimiter detection, preserving commas and
    // semicolons that legitimately belong to its query string.
    const queryBoundary = [line.indexOf("?"), line.indexOf("#")]
      .filter((index) => index >= 0)
      .sort((left, right) => left - right)[0] ?? -1;
    const delimiterPositions = [...line.matchAll(/[,\t;]/g)]
      .map((match) => match.index);
    const delimitersBelongToQuery = queryBoundary >= 0
      && delimiterPositions.every((index) => index > queryBoundary);
    if (
      /^https?:\/\//i.test(line)
      && normalizeJobUrl(line)
      && (delimiterPositions.length === 0 || delimitersBelongToQuery)
    ) {
      cells.push(line);
      continue;
    }

    const delimiter = ["\t", ",", ";"]
      .map((value) => ({ value, count: parseDelimitedRow(line, value).length }))
      .sort((left, right) => right.count - left.count)[0];
    const rowCells = delimiter && delimiter.count > 1
      ? parseDelimitedRow(line, delimiter.value)
      : [line.replace(/^["']|["']$/g, "")];
    cells.push(...rowCells);
  }
  return cells;
}

export function parseJobImportText(text: string): {
  urls: string[];
  invalidCount: number;
  repeatedCount: number;
  overflowCount: number;
} {
  const candidates = candidateCells(text).map((value) => value.trim()).filter(Boolean);
  const urls: string[] = [];
  const seen = new Set<string>();
  let invalidCount = 0;
  let repeatedCount = 0;

  for (const candidate of candidates) {
    const looksLikeUrl = /^https?:\/\//i.test(candidate);
    if (!looksLikeUrl) continue;
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
