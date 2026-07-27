import type { NormalizedDiscoveryRequest } from "./job-discovery-request.ts";

export type DiscoveryCounts = {
  resultCount: number;
  newCount: number;
  changedCount: number;
  expiredCount: number;
};

export function prepareSavedSearchPayload(
  request: NormalizedDiscoveryRequest,
  updatedAt: string,
): Record<string, unknown> {
  return {
    client_id: request.clientId,
    source: request.source,
    search_term: request.parameters.searchTerm,
    location: request.parameters.location,
    country: request.parameters.country,
    work_type: request.parameters.workType,
    date_range_days: request.parameters.dateRangeDays,
    max_results: request.parameters.maxResults,
    is_active: true,
    created_by: request.actorId,
    updated_at: updatedAt,
  };
}

export function prepareDiscoveryRunPayload(options: {
  request: NormalizedDiscoveryRequest;
  searchId: string;
  scheduled: boolean;
  leaseToken: string | null;
  adapterVersion: string;
}): Record<string, unknown> {
  const { request } = options;
  return {
    client_id: request.clientId,
    search_id: options.searchId,
    source: request.source,
    search_term: request.parameters.searchTerm,
    location: request.parameters.location,
    created_by: request.actorId,
    trigger_type: options.scheduled ? "scheduled" : "manual",
    lease_token: options.leaseToken,
    adapter_version: options.adapterVersion,
    compliance_policy_version: request.policyVersion,
  };
}

export function normalizeDiscoveryCounts(
  value: Record<string, unknown>,
): DiscoveryCounts {
  return {
    resultCount: Number(value.result_count ?? 0),
    newCount: Number(value.new_count ?? 0),
    changedCount: Number(value.changed_count ?? 0),
    expiredCount: Number(value.expired_count ?? 0),
  };
}

export function prepareDiscoveryCompletion(options: {
  counts: DiscoveryCounts;
  completeSnapshot: boolean;
  providerCostUsd: number;
  durationMs: number;
  completedAt: string;
}): Record<string, unknown> {
  return {
    status: "completed",
    result_count: options.counts.resultCount,
    new_count: options.counts.newCount,
    changed_count: options.counts.changedCount,
    expired_count: options.counts.expiredCount,
    complete_snapshot: options.completeSnapshot,
    cost_usd: options.providerCostUsd,
    duration_ms: options.durationMs,
    completed_at: options.completedAt,
  };
}
