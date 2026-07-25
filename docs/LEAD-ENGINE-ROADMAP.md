# Lead-engine roadmap

## Phase 1 — Job-ad ingestion

Import one public vacancy URL, extract structured hiring evidence, and require
human approval. Implemented by `job-ad-ingest`.

## Phase 2 — Job discovery

Search approved public job sources through Apify, deduplicate results, and send
selected discoveries through Phase 1. Implemented by `job-ad-discover`.

## Phase 2.5 — Legacy retirement

The unauthenticated `engine-jobs-scrape` implementation is replaced by an
authenticated `410 Gone` tombstone. New callers use Phase 2 followed by Phase 1.

## Phase 3 — Company enrichment

After a job advertisement is approved:

1. Prefer its extracted official public HTTPS company website. When absent,
   search for an official domain and proceed only when one candidate clears a
   strict deterministic threshold and margin. Ambiguous results stop for review.
2. Reuse `lead_companies` when the tenant and normalized domain already exist.
3. Inspect the official home page and discover up to three same-domain About,
   Company, Services, What We Do, or Contact pages.
4. Store company name, industry, location, services, description, and website.
5. Store source-backed facts and machine inferences separately.
6. Preserve the URL, verified page excerpt, confidence, resolver candidates,
   provider run IDs and cost, model, prompt version, input hash, and token count.
7. Require explicit company approval before Phase 4.

Phase 3 never creates or updates `crm_contacts`. A company name is not evidence
that a particular human exists.

Only one enrichment can run for a tenant and job at a time. Runs older than ten
minutes are closed before retry, facts and review events are append-only to the
service role, and failed company enrichment attempts are visible in Job Leads.

## Phase 4 — Transparent lead scoring

Phase 4 is not yet implemented. It will score only approved companies using
versioned, reproducible components:

- target-role match;
- target geography;
- advertisement recency;
- hiring urgency;
- company fit;
- outsourcing or placement suitability;
- data completeness;
- evidence confidence.

Every component must expose its rule, input facts, points, and explanation.
There will be no unexplained AI-generated total and no automatic creation of a
human CRM contact.
