import type {
  DiscoveryParameters,
  JobDiscoverySource,
} from "./job-discovery.ts";
import { isUuid } from "./validation.ts";

const SOURCES = new Set<JobDiscoverySource>(["seek", "indeed", "linkedin"]);

export type NormalizedDiscoveryRequest = {
  actorId: string;
  clientId: string;
  source: JobDiscoverySource;
  parameters: DiscoveryParameters;
  searchId: string | null;
  policyVersion: string | null;
};

function cleanText(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, max)
    : "";
}

function normalizeParameters(
  value: Record<string, unknown>,
): DiscoveryParameters {
  return {
    searchTerm: cleanText(value.searchTerm ?? value.search_term, 120),
    location: cleanText(value.location, 120),
    country:
      cleanText(value.country, 2).toUpperCase() || "AU",
    workType: cleanText(value.workType ?? value.work_type, 50),
    maxResults: Math.floor(
      Number(value.maxResults ?? value.max_results ?? 25),
    ),
    dateRangeDays: Math.floor(
      Number(value.dateRangeDays ?? value.date_range_days ?? 7),
    ),
  };
}

export function normalizeManualDiscoveryRequest(
  body: Record<string, unknown>,
  actorId: string,
): NormalizedDiscoveryRequest {
  return {
    actorId,
    clientId: typeof body.clientId === "string" ? body.clientId : "",
    source: body.source as JobDiscoverySource,
    parameters: normalizeParameters(body),
    searchId: null,
    policyVersion: null,
  };
}

export function normalizeScheduledDiscoveryRequest(
  leasedSearch: Record<string, unknown>,
  searchId: string,
): NormalizedDiscoveryRequest {
  return {
    actorId: String(leasedSearch.schedule_approved_by ?? ""),
    clientId: String(leasedSearch.client_id ?? ""),
    source: leasedSearch.source as JobDiscoverySource,
    parameters: normalizeParameters(leasedSearch),
    searchId,
    policyVersion: String(
      leasedSearch.compliance_policy_version ?? "",
    ),
  };
}

export function validateDiscoveryRequest(
  request: NormalizedDiscoveryRequest,
): string | null {
  const { parameters } = request;
  if (
    !isUuid(request.actorId)
    || !isUuid(request.clientId)
    || !SOURCES.has(request.source)
    || parameters.searchTerm.length < 2
    || !/^[A-Z]{2}$/.test(parameters.country)
    || !Number.isInteger(parameters.maxResults)
    || parameters.maxResults < 10
    || parameters.maxResults > 50
    || !Number.isInteger(parameters.dateRangeDays)
    || parameters.dateRangeDays < 1
    || parameters.dateRangeDays > 30
  ) {
    return "Search filters are outside the supported limits.";
  }
  return null;
}
