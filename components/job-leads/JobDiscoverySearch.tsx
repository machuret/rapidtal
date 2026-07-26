"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Loader2, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavedSearch {
  id: string;
  source: "seek" | "indeed" | "linkedin";
  search_term: string;
  location: string;
  schedule_enabled: boolean;
  schedule_interval_minutes: number;
  next_run_at: string | null;
  backoff_until: string | null;
  consecutive_failures: number;
}

interface SourcePolicy {
  source: SavedSearch["source"];
  scheduled_access_enabled: boolean;
  min_interval_minutes: number;
  max_results_per_run: number;
  policy_version: string;
  terms_url: string;
}

export function JobDiscoverySearch({
  clientId,
  savedSearches,
  sourcePolicies,
}: {
  clientId: string;
  savedSearches: SavedSearch[];
  sourcePolicies: SourcePolicy[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("seek");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("Sydney");
  const [scheduleLoading, setScheduleLoading] = useState<string | null>(null);
  const [scheduleIntervals, setScheduleIntervals] = useState<Record<string, number>>(
    Object.fromEntries(
      savedSearches.map((search) => [search.id, search.schedule_interval_minutes]),
    ),
  );
  const policyBySource = new Map(sourcePolicies.map((policy) => [policy.source, policy]));

  async function updateSchedule(search: SavedSearch, enabled: boolean) {
    setScheduleLoading(search.id);
    try {
      const res = await fetch("/api/job-leads/search-schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          searchId: search.id,
          enabled,
          intervalMinutes: scheduleIntervals[search.id] ?? search.schedule_interval_minutes,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The saved-search schedule could not be updated.");
        return;
      }
      toast.success(enabled ? "Automated discovery enabled." : "Automated discovery paused.");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setScheduleLoading(null);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/job-leads/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          source,
          searchTerm,
          location,
          country: "AU",
          workType: "",
          dateRangeDays: 7,
          maxResults: 25,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "The job search could not be completed.");
        return;
      }
      toast.success(`${body.newCount} new of ${body.count} discovered jobs saved.`);
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-2">
          <Search className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h2 className="font-semibold text-zinc-100">Discover job advertisements</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Search approved public sources through source-specific adapters. Results enter a
            review queue before extraction.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[150px_1fr_1fr_auto] sm:items-end">
        <div>
          <Label htmlFor="discovery-source">Source</Label>
          <select
            id="discovery-source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            disabled={loading}
            className="mt-1.5 h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm"
          >
            <option value="seek">SEEK</option>
            <option value="indeed">Indeed</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div>
          <Label htmlFor="discovery-term">Role or keyword</Label>
          <Input
            id="discovery-term"
            required
            minLength={2}
            maxLength={120}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Marketing manager"
            disabled={loading}
            className="mt-1.5 bg-zinc-800 border-zinc-700"
          />
        </div>
        <div>
          <Label htmlFor="discovery-location">Location</Label>
          <Input
            id="discovery-location"
            maxLength={120}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Sydney"
            disabled={loading}
            className="mt-1.5 bg-zinc-800 border-zinc-700"
          />
        </div>
        <Button type="submit" disabled={loading || searchTerm.trim().length < 2} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "Searching…" : "Discover"}
        </Button>
      </div>
      {savedSearches.length > 0 && (
        <div className="mt-5 space-y-3 border-t border-zinc-800 pt-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock3 className="h-3.5 w-3.5" />
            Saved searches and automation
          </div>
          {savedSearches.map((search) => {
            const policy = policyBySource.get(search.source);
            const approved = policy?.scheduled_access_enabled === true;
            const interval = scheduleIntervals[search.id] ?? search.schedule_interval_minutes;
            const availableIntervals = [360, 720, 1440, 10080]
              .filter((value) => value >= (policy?.min_interval_minutes ?? 60));
            if (!availableIntervals.includes(interval)) availableIntervals.push(interval);
            availableIntervals.sort((a, b) => a - b);
            const nextRun = search.backoff_until ?? search.next_run_at;

            return (
              <div
                key={search.id}
                className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setSource(search.source);
                      setSearchTerm(search.search_term);
                      setLocation(search.location);
                    }}
                    className="text-left"
                  >
                    <span className="text-sm font-medium text-zinc-200">
                      {search.search_term}
                      {search.location ? ` · ${search.location}` : ""}
                    </span>
                    <span className="ml-2 uppercase text-[10px] text-zinc-500">
                      {search.source}
                    </span>
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label={`Schedule interval for ${search.search_term}`}
                      value={interval}
                      disabled={search.schedule_enabled || scheduleLoading === search.id}
                      onChange={(event) => setScheduleIntervals((current) => ({
                        ...current,
                        [search.id]: Number(event.target.value),
                      }))}
                      className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-xs"
                    >
                      {availableIntervals.map((value) => (
                        <option key={value} value={value}>
                          {value === 10080
                            ? "Weekly"
                            : value % 1440 === 0
                              ? `Every ${value / 1440} day`
                              : `Every ${value / 60} hours`}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      size="sm"
                      variant={search.schedule_enabled ? "outline" : "default"}
                      disabled={
                        scheduleLoading === search.id
                        || (!search.schedule_enabled && !approved)
                      }
                      onClick={() => updateSchedule(search, !search.schedule_enabled)}
                      className="h-8 gap-1.5"
                    >
                      {scheduleLoading === search.id && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                      {search.schedule_enabled ? "Pause" : "Enable"}
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  {approved ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Source access authorized
                    </span>
                  ) : (
                    <span>
                      Automation locked until a super admin records source authorization.
                    </span>
                  )}
                  {policy?.terms_url && (
                    <a
                      href={policy.terms_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-200"
                    >
                      Source access terms
                    </a>
                  )}
                  {search.schedule_enabled && nextRun && (
                    <span>
                      {search.backoff_until ? "Retry" : "Next run"}{" "}
                      {new Date(nextRun).toLocaleString()}
                    </span>
                  )}
                  {search.consecutive_failures > 0 && (
                    <span className="text-amber-400">
                      {search.consecutive_failures} consecutive failure
                      {search.consecutive_failures === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </form>
  );
}
