import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { getCurrentUserAndClient } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { JobLeadIngest } from "@/components/job-leads/JobLeadIngest";
import { JobLeadReviewActions } from "@/components/job-leads/JobLeadReviewActions";
import { JobDiscoverySearch } from "@/components/job-leads/JobDiscoverySearch";
import { JobDiscoveryActions } from "@/components/job-leads/JobDiscoveryActions";
import { CompanyEnrichmentActions } from "@/components/job-leads/CompanyEnrichmentActions";
import { LeadScoreActions } from "@/components/job-leads/LeadScoreActions";
import { LeadScoringProfileForm } from "@/components/job-leads/LeadScoringProfileForm";
import { CrmPromotionActions } from "@/components/job-leads/CrmPromotionActions";
import { RetryScrapeButton } from "@/components/job-leads/RetryScrapeButton";
import type {
  DbCrmCompany,
  DbLeadScore,
  DbLeadScoreComponent,
  DbLeadScoringProfile,
  DbJobAd,
  DbJobDiscovery,
  DbJobScrapeRun,
  DbJobSearch,
  DbLeadCompany,
  DbCompanyEnrichmentRun,
} from "@/types/database";

export const dynamic = "force-dynamic";
export const metadata = { title: "Job Leads — RapidTal" };

type JobLeadListItem = Pick<
  DbJobAd,
  "id" | "canonical_url" | "title" | "company_name" | "location"
    | "company_website" | "company_id" | "lead_score_id" | "extraction_hash"
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

type FailedCompanyRunListItem = Pick<
  DbCompanyEnrichmentRun,
  "id" | "job_ad_id" | "domain" | "error_code" | "error_message" | "started_at"
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

type CompanyListItem = Pick<
  DbLeadCompany,
  "id" | "domain" | "website_url" | "name" | "industry" | "location"
    | "services" | "description" | "inferred_data" | "evidence" | "status"
    | "last_enriched_at" | "enrichment_hash"
>;

type LeadScoreListItem = Pick<
  DbLeadScore,
  "id" | "job_ad_id" | "ruleset_version" | "profile_version" | "total_score"
    | "score_band" | "summary" | "job_extraction_hash" | "company_enrichment_hash"
    | "created_at"
>;

type LeadScoreComponentListItem = Pick<
  DbLeadScoreComponent,
  "lead_score_id" | "component" | "points" | "max_points" | "reason"
>;

const SCORE_COMPONENT_LABELS: Record<DbLeadScoreComponent["component"], string> = {
  target_role: "Target role",
  target_geography: "Target geography",
  advertisement_recency: "Advertisement recency",
  hiring_urgency: "Hiring urgency",
  company_fit: "Company fit",
  outsourcing_suitability: "Outsourcing suitability",
  data_completeness_confidence: "Data completeness & confidence",
};

function scoreTone(band: DbLeadScore["score_band"]): string {
  if (band === "high") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  if (band === "medium") return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  return "border-zinc-600 bg-zinc-800 text-zinc-300";
}

function salaryLabel(job: JobLeadListItem): string | null {
  if (job.salary_min === null && job.salary_max === null) return null;
  const currency = job.salary_currency ? `${job.salary_currency} ` : "";
  const min = job.salary_min === null ? "" : Number(job.salary_min).toLocaleString();
  const max = job.salary_max === null ? "" : Number(job.salary_max).toLocaleString();
  const range = min && max ? `${min}–${max}` : min || max;
  return `${currency}${range}${job.salary_period ? ` / ${job.salary_period}` : ""}`;
}

function companyEvidenceItems(evidence: Record<string, unknown>) {
  const items: { key: string; url: string; excerpt: string; confidence: number }[] = [];
  for (const [field, raw] of Object.entries(evidence)) {
    const values = Array.isArray(raw) ? raw : [raw];
    for (const [index, value] of values.entries()) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const record = value as Record<string, unknown>;
      if (typeof record.source_url !== "string" || typeof record.excerpt !== "string") continue;
      items.push({
        key: `${field}-${index}`,
        url: record.source_url,
        excerpt: record.excerpt,
        confidence: Number(record.confidence) || 0,
      });
    }
  }
  return items;
}

function sourceHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "Source page";
  }
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JobLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusFilter = typeof params.status === "string" ? params.status : "all";
  const scoreFilter = typeof params.score === "string" ? params.score : "all";
  const query = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const minScore = typeof params.minScore === "string"
    ? Math.min(100, Math.max(0, Number(params.minScore) || 0))
    : 0;
  const ctx = await getCurrentUserAndClient();
  if (!ctx) redirect("/login");
  if (ctx.user.role !== "client_admin" || !ctx.user.client_id) redirect("/dashboard");
  const clientId = ctx.user.client_id;

  const admin = createAdminClient();
  const [
    jobResult,
    failedRunResult,
    scoringProfileResult,
    discoveryResult,
    searchResult,
    failedCompanyRunResult,
  ] = await Promise.all([
    admin
      .from("job_ads")
      .select(`
        id, canonical_url, title, company_name, company_website, company_id,
        lead_score_id, extraction_hash,
        location, remote_type,
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
      .from("lead_scoring_profiles")
      .select("*")
      .eq("client_id", clientId)
      .single(),
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
    admin
      .from("company_enrichment_runs")
      .select("id, job_ad_id, domain, error_code, error_message, started_at")
      .eq("client_id", clientId)
      .eq("status", "failed")
      .order("started_at", { ascending: false })
      .limit(10),
  ]);

  const jobs = (jobResult.data ?? []) as JobLeadListItem[];
  const linkedCompanyIds = [
    ...new Set(jobs.flatMap((job) => job.company_id ? [job.company_id] : [])),
  ];
  const companyResult = await admin
    .from("lead_companies")
    .select(`
      id, domain, website_url, name, industry, location, services,
      description, inferred_data, evidence, status, last_enriched_at, enrichment_hash
    `)
    .eq("client_id", clientId)
    .in(
      "id",
      linkedCompanyIds.length
        ? linkedCompanyIds
        : ["00000000-0000-0000-0000-000000000000"],
    );
  const crmCompanyResult = await admin
    .from("crm_companies")
    .select("*")
    .eq("client_id", clientId)
    .in(
      "lead_company_id",
      linkedCompanyIds.length
        ? linkedCompanyIds
        : ["00000000-0000-0000-0000-000000000000"],
    );
  const linkedScoreIds = [
    ...new Set(jobs.flatMap((job) => job.lead_score_id ? [job.lead_score_id] : [])),
  ];
  const scoreResult = await admin
    .from("lead_scores")
    .select(`
      id, job_ad_id, ruleset_version, profile_version, total_score, score_band,
      summary, job_extraction_hash, company_enrichment_hash, created_at
    `)
    .eq("client_id", clientId)
    .in(
      "id",
      linkedScoreIds.length
        ? linkedScoreIds
        : ["00000000-0000-0000-0000-000000000000"],
    );
  const scores = (scoreResult.data ?? []) as LeadScoreListItem[];
  const scoreIds = scores.map((score) => score.id);
  const scoreComponentResult = await admin
    .from("lead_score_components")
    .select("lead_score_id, component, points, max_points, reason")
    .eq("client_id", clientId)
    .in(
      "lead_score_id",
      scoreIds.length ? scoreIds : ["00000000-0000-0000-0000-000000000000"],
    );
  const failedRuns = (failedRunResult.data ?? []) as FailedRunListItem[];
  const failedCompanyRuns = (failedCompanyRunResult.data ?? []) as FailedCompanyRunListItem[];
  const discoveries = (discoveryResult.data ?? []) as DiscoveryListItem[];
  const savedSearches = (searchResult.data ?? []) as SavedSearchListItem[];
  const companies = (companyResult.data ?? []) as CompanyListItem[];
  const scoringProfile = scoringProfileResult.data as DbLeadScoringProfile | null;
  const scoreComponents = (scoreComponentResult.data ?? []) as LeadScoreComponentListItem[];
  const companiesById = new Map(companies.map((company) => [company.id, company]));
  const scoresById = new Map(scores.map((score) => [score.id, score]));
  const componentsByScoreId = new Map<string, LeadScoreComponentListItem[]>();
  const crmCompanies = (crmCompanyResult.data ?? []) as DbCrmCompany[];
  const crmCompaniesByLeadCompanyId = new Map(
    crmCompanies.map((company) => [company.lead_company_id, company]),
  );
  for (const component of scoreComponents) {
    const existing = componentsByScoreId.get(component.lead_score_id) ?? [];
    existing.push(component);
    componentsByScoreId.set(component.lead_score_id, existing);
  }
  const displayedJobs = jobs.filter((job) => {
    const score = job.lead_score_id ? scoresById.get(job.lead_score_id) : null;
    if (statusFilter !== "all" && job.status !== statusFilter) return false;
    if (scoreFilter === "unscored" && score) return false;
    if (["high", "medium", "low"].includes(scoreFilter) && score?.score_band !== scoreFilter) return false;
    if (score && score.total_score < minScore) return false;
    if (!score && minScore > 0) return false;
    if (query && ![
      job.title,
      job.company_name,
      job.location,
      job.canonical_url,
    ].some((value) => value?.toLowerCase().includes(query))) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Job Leads</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Extract hiring signals for {ctx.client?.name ?? "your company"}.
        </p>
      </div>

      <JobDiscoverySearch clientId={clientId} savedSearches={savedSearches} />
      <JobLeadIngest clientId={clientId} existingUrls={jobs.map((job) => job.canonical_url)} />
      {scoringProfile && (
        <LeadScoringProfileForm clientId={clientId} profile={scoringProfile} />
      )}

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
      {companyResult.error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
          Company enrichment data could not be loaded: {companyResult.error.message}
        </div>
      )}
      {crmCompanyResult.error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300">
          CRM promotion state could not be loaded. Import migration 025 before using Phase 5.
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

      {jobs.length > 0 && (
        <form className="mb-4 grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            name="q"
            defaultValue={typeof params.q === "string" ? params.q : ""}
            placeholder="Search role, company, location"
            className="h-9 rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm lg:col-span-2"
          />
          <select name="status" defaultValue={statusFilter} className="h-9 rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm">
            <option value="all">All review states</option>
            <option value="needs_review">Needs review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select name="score" defaultValue={scoreFilter} className="h-9 rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm">
            <option value="all">All score bands</option>
            <option value="high">High score</option>
            <option value="medium">Medium score</option>
            <option value="low">Low score</option>
            <option value="unscored">Not scored</option>
          </select>
          <div className="flex gap-2">
            <input name="minScore" type="number" min={0} max={100} defaultValue={minScore || ""} placeholder="Min score" className="h-9 min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 text-sm" />
            <button className="h-9 rounded-md bg-zinc-100 px-3 text-sm font-medium text-zinc-900">Filter</button>
          </div>
          <p className="text-xs text-zinc-500 sm:col-span-2 lg:col-span-5">
            Showing {displayedJobs.length} of {jobs.length} job leads.
          </p>
        </form>
      )}

      {jobs.length > 0 && displayedJobs.length === 0 && (
        <div className="mb-4 rounded-xl border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-400">
          No job leads match these filters.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {displayedJobs.map((job) => {
          const salary = salaryLabel(job);
          const company = job.company_id ? companiesById.get(job.company_id) ?? null : null;
          const companyEvidence = company ? companyEvidenceItems(company.evidence) : [];
          const leadScore = job.lead_score_id ? scoresById.get(job.lead_score_id) ?? null : null;
          const leadScoreComponents = leadScore
            ? componentsByScoreId.get(leadScore.id) ?? []
            : [];
          const scoreIsStale = Boolean(
            leadScore
            && scoringProfile
            && (
              leadScore.profile_version !== scoringProfile.version
              || leadScore.job_extraction_hash !== job.extraction_hash
              || leadScore.company_enrichment_hash !== company?.enrichment_hash
            )
          );
          const crmCompany = company
            ? crmCompaniesByLeadCompanyId.get(company.id) ?? null
            : null;
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

              {job.status === "approved" && (
                <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-violet-200">Employer company</h3>
                      <p className="mt-1 text-xs text-zinc-400">
                        Source-backed company facts remain separate from machine inferences.
                      </p>
                    </div>
                    {company && (
                      <span className="w-fit rounded-full border border-violet-500/30 px-2 py-0.5 text-xs text-violet-300">
                        {company.status.replaceAll("_", " ")}
                      </span>
                    )}
                  </div>

                  {company && (
                    <div className="mt-3 space-y-3">
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-300">
                        <a
                          href={company.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {company.name ?? company.domain}
                        </a>
                        {company.industry && <span>{company.industry}</span>}
                        {company.location && <span>{company.location}</span>}
                      </div>
                      {company.services.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {company.services.map((service) => (
                            <span key={service} className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                              {service}
                            </span>
                          ))}
                        </div>
                      )}
                      {company.description && (
                        <p className="text-sm text-zinc-400">{company.description}</p>
                      )}
                      {companyEvidence.length > 0 && (
                        <details className="rounded border border-zinc-700 bg-zinc-950/50">
                          <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-zinc-300">
                            Source-backed company evidence
                          </summary>
                          <div className="space-y-3 border-t border-zinc-700 px-3 py-3">
                            {companyEvidence.map((item) => (
                              <div key={item.key}>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                  {sourceHostname(item.url)}
                                </a>
                                <p className="mt-1 text-sm text-zinc-300">{item.excerpt}</p>
                                <p className="mt-1 text-xs text-zinc-600">
                                  {Math.round(item.confidence * 100)}% confidence
                                </p>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                      {Object.keys(company.inferred_data).length > 0 && (
                        <details className="rounded border border-amber-500/20 bg-amber-500/5">
                          <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-amber-300">
                            Inferred information — not source-backed
                          </summary>
                          <dl className="space-y-2 border-t border-amber-500/20 px-3 py-3">
                            {Object.entries(company.inferred_data).map(([field, value]) => (
                              <div key={field}>
                                <dt className="text-xs text-zinc-500">{field.replaceAll("_", " ")}</dt>
                                <dd className="text-sm text-zinc-300">
                                  {Array.isArray(value) ? value.join(", ") : String(value)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </details>
                      )}
                    </div>
                  )}

                  <CompanyEnrichmentActions
                    clientId={clientId}
                    jobAdId={job.id}
                    companyId={company?.id ?? null}
                    companyStatus={company?.status ?? null}
                    canResolveCompany={Boolean(job.company_website || job.company_name)}
                  />

                  {company?.status === "approved" && (
                    <div className="mt-4 border-t border-violet-500/20 pt-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-cyan-200">Transparent lead score</h3>
                          <p className="mt-1 text-xs text-zinc-400">
                            Fixed ruleset with stored points, inputs, and reasons. No AI-generated score.
                          </p>
                        </div>
                        <LeadScoreActions
                          clientId={clientId}
                          jobAdId={job.id}
                          hasScore={Boolean(leadScore)}
                        />
                      </div>

                      {leadScore && (
                        <div className="mt-3 rounded-lg border border-zinc-700 bg-zinc-950/60 p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 py-1 text-sm font-semibold ${scoreTone(leadScore.score_band)}`}>
                              {leadScore.total_score}/100 · {leadScore.score_band}
                            </span>
                            <span className="text-xs text-zinc-500">{leadScore.ruleset_version}</span>
                            {scoreIsStale && (
                              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
                                recalculation required
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-zinc-200">{leadScore.summary}</p>
                          <div className="mt-3 grid gap-2 md:grid-cols-2">
                            {leadScoreComponents
                              .sort((left, right) => right.max_points - left.max_points)
                              .map((component) => (
                                <div key={component.component} className="rounded border border-zinc-800 p-2.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-medium text-zinc-300">
                                      {SCORE_COMPONENT_LABELS[component.component]}
                                    </p>
                                    <p className="text-xs font-semibold text-cyan-300">
                                      {component.points}/{component.max_points}
                                    </p>
                                  </div>
                                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                                    {component.reason}
                                  </p>
                                </div>
                              ))}
                          </div>
                          <p className="mt-2 text-xs text-zinc-600">
                            Calculated {formatDistanceToNow(new Date(leadScore.created_at), { addSuffix: true })}
                            {" · "}profile version {leadScore.profile_version}
                          </p>
                        </div>
                      )}
                      <CrmPromotionActions
                        clientId={clientId}
                        jobAdId={job.id}
                        companyId={company.id}
                        crmCompanyId={crmCompany?.id ?? null}
                      />
                    </div>
                  )}
                </div>
              )}

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

      {(failedRuns.length > 0 || failedCompanyRuns.length > 0) && (
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
                <div className="mt-2">
                  <RetryScrapeButton clientId={clientId} url={run.requested_url} />
                </div>
              </div>
            ))}
            {failedCompanyRuns.map((run) => {
              const job = jobs.find((item) => item.id === run.job_ad_id);
              return (
                <div key={run.id} className="bg-zinc-900 px-4 py-3">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <p className="truncate text-sm text-zinc-300">
                      Company enrichment · {job?.company_name ?? run.domain ?? "Unresolved employer"}
                    </p>
                    <p className="shrink-0 text-xs text-zinc-600">
                      {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-red-300">
                    {run.error_message ?? run.error_code ?? "Unknown company enrichment failure"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
