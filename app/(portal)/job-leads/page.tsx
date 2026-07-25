import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { getCurrentUserAndClient } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { JobLeadIngest } from "@/components/job-leads/JobLeadIngest";
import { JobLeadReviewActions } from "@/components/job-leads/JobLeadReviewActions";
import { JobDiscoverySearch } from "@/components/job-leads/JobDiscoverySearch";
import { JobDiscoveryActions } from "@/components/job-leads/JobDiscoveryActions";
import type { DbJobAd, DbJobDiscovery, DbJobScrapeRun, DbJobSearch } from "@/types/database";

export const dynamic = "force-dynamic";
export const metadata = { title: "Job Leads — RapidTal" };

type JobLeadListItem = Pick<
  DbJobAd,
  "id" | "canonical_url" | "title" | "company_name" | "location"
    | "remote_type" | "employment_type" | "salary_min" | "salary_max"
    | "salary_currency" | "salary_period" | "skills" | "status"
    | "description" | "responsibilities" | "field_evidence" | "posted_at"
    | "expires_at" | "reviewed_at" | "extraction_confidence"
    | "extraction_method" | "last_seen_at"
>;

type FailedRunListItem = Pick<
  DbJobScrapeRun,
  "id" | "requested_url" | "error_code" | "error_message" | "started_at"
>;

type DiscoveryListItem = Pick<
  DbJobDiscovery,
  "id" | "source" | "job_url" | "title" | "company_name" | "location"
    | "salary_text" | "work_type" | "work_arrangement" | "summary" | "listed_at"
    | "last_seen_at"
>;

type SavedSearchListItem = Pick<
  DbJobSearch,
  "id" | "source" | "search_term" | "location"
>;

function salaryLabel(job: JobLeadListItem): string | null {
  if (job.salary_min === null && job.salary_max === null) return null;
  const currency = job.salary_currency ? `${job.salary_currency} ` : "";
  const min = job.salary_min === null ? "" : Number(job.salary_min).toLocaleString();
  const max = job.salary_max === null ? "" : Number(job.salary_max).toLocaleString();
  const range = min && max ? `${min}–${max}` : min || max;
  return `${currency}${range}${job.salary_period ? ` / ${job.salary_period}` : ""}`;
}

export default async function JobLeadsPage() {
  const ctx = await getCurrentUserAndClient();
  if (!ctx) redirect("/login");
  if (ctx.user.role !== "client_admin" || !ctx.user.client_id) redirect("/dashboard");
  const clientId = ctx.user.client_id;

  const admin = createAdminClient();
  const [jobResult, failedRunResult, discoveryResult, searchResult] = await Promise.all([
    admin
      .from("job_ads")
      .select(`
        id, canonical_url, title, company_name, location, remote_type,
        employment_type, salary_min, salary_max, salary_currency, salary_period,
        description, responsibilities, skills, field_evidence, posted_at, expires_at,
        extraction_method, extraction_confidence, status, reviewed_at, last_seen_at
      `)
      .eq("client_id", clientId)
      .order("updated_at", { ascending: false })
      .limit(100),
    admin
      .from("job_scrape_runs")
      .select("id, requested_url, error_code, error_message, started_at")
      .eq("client_id", clientId)
      .eq("status", "failed")
      .order("started_at", { ascending: false })
      .limit(10),
    admin
      .from("job_discoveries")
      .select(`
        id, source, job_url, title, company_name, location, salary_text,
        work_type, work_arrangement, summary, listed_at, last_seen_at
      `)
      .eq("client_id", clientId)
      .eq("status", "new")
      .order("last_seen_at", { ascending: false })
      .limit(50),
    admin
      .from("job_searches")
      .select("id, source, search_term, location")
      .eq("client_id", clientId)
      .eq("is_active", true)
      .order("last_run_at", { ascending: false, nullsFirst: false })
      .limit(5),
  ]);

  const jobs = (jobResult.data ?? []) as JobLeadListItem[];
  const failedRuns = (failedRunResult.data ?? []) as FailedRunListItem[];
  const discoveries = (discoveryResult.data ?? []) as DiscoveryListItem[];
  const savedSearches = (searchResult.data ?? []) as SavedSearchListItem[];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Job Leads</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Extract hiring signals for {ctx.client?.name ?? "your company"}.
        </p>
      </div>

      <JobDiscoverySearch clientId={clientId} savedSearches={savedSearches} />
      <JobLeadIngest clientId={clientId} />

      {discoveries.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">Discovery queue</h2>
              <p className="text-sm text-zinc-500">
                {discoveries.length} public listings waiting for extraction.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {discoveries.map((item) => (
              <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium uppercase tracking-wide text-violet-400">
                      {item.source}
                    </span>
                    <h3 className="mt-1 font-semibold text-zinc-100">{item.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {item.company_name ?? "Company not identified"}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>
                  <a
                    href={item.job_url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs text-blue-400 hover:text-blue-300"
                  >
                    Source
                  </a>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                  {item.salary_text && <span>{item.salary_text}</span>}
                  {item.work_type && <span>{item.work_type}</span>}
                  {item.work_arrangement && <span>{item.work_arrangement}</span>}
                  {item.listed_at && (
                    <span>listed {formatDistanceToNow(new Date(item.listed_at), { addSuffix: true })}</span>
                  )}
                </div>
                {item.summary && <p className="mt-3 line-clamp-3 text-sm text-zinc-400">{item.summary}</p>}
                <JobDiscoveryActions
                  clientId={clientId}
                  discoveryId={item.id}
                  jobUrl={item.job_url}
                />
              </article>
            ))}
          </div>
        </section>
      )}

      {jobResult.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
          Job leads could not be loaded: {jobResult.error.message}
        </div>
      )}

      {!jobResult.error && jobs.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
          <p className="text-zinc-300 font-medium">No job advertisements yet</p>
          <p className="text-zinc-500 text-sm mt-1">
            Paste a public vacancy URL above to create the first review item.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => {
          const salary = salaryLabel(job);
          return (
            <article key={job.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
                      {job.status.replaceAll("_", " ")}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {Math.round(Number(job.extraction_confidence) * 100)}% extraction confidence
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                  <p className="text-sm text-zinc-300 mt-1">
                    {job.company_name ?? "Company not identified"}
                  </p>
                </div>
                <a
                  href={job.canonical_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
                >
                  View source <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-400 mt-4">
                {job.location && <span>{job.location}</span>}
                <span className="capitalize">{job.remote_type}</span>
                {job.employment_type && <span>{job.employment_type}</span>}
                {salary && <span>{salary}</span>}
              </div>

              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.skills.slice(0, 8).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <details className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/50">
                <summary className="cursor-pointer px-3 py-2 text-sm text-zinc-300">
                  Review extracted evidence
                </summary>
                <div className="border-t border-zinc-800 px-3 py-3 space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Description
                    </h3>
                    <p className="mt-1 text-sm text-zinc-300 whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>

                  {job.responsibilities.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Responsibilities
                      </h3>
                      <ul className="mt-1 list-disc pl-5 text-sm text-zinc-300 space-y-1">
                        {job.responsibilities.map((responsibility) => (
                          <li key={responsibility}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Object.keys(job.field_evidence).length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Source evidence
                      </h3>
                      <dl className="mt-1 space-y-2">
                        {Object.entries(job.field_evidence).map(([field, evidence]) => (
                          <div key={field}>
                            <dt className="text-xs text-zinc-500">{field.replaceAll("_", " ")}</dt>
                            <dd className="text-sm text-zinc-300">{evidence}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </details>

              <JobLeadReviewActions
                clientId={clientId}
                jobAdId={job.id}
                status={job.status}
              />

              <p className="text-xs text-zinc-600 mt-4">
                Last checked {formatDistanceToNow(new Date(job.last_seen_at), { addSuffix: true })}
                {" · "}
                {job.extraction_method.replaceAll("_", " ").replace("+", " + ")}
                {job.reviewed_at && (
                  <>
                    {" · "}
                    reviewed {formatDistanceToNow(new Date(job.reviewed_at), { addSuffix: true })}
                  </>
                )}
              </p>
            </article>
          );
        })}
      </div>

      {failedRuns.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Recent failed attempts</h2>
          </div>
          <div className="rounded-xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
            {failedRuns.map((run) => (
              <div key={run.id} className="bg-zinc-900 px-4 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="text-sm text-zinc-300 truncate">{run.requested_url}</p>
                  <p className="text-xs text-zinc-600 shrink-0">
                    {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-xs text-red-300 mt-1">
                  {run.error_message ?? run.error_code ?? "Unknown ingestion failure"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
