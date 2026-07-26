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

Phase 4 scores only approved advertisements linked to approved companies using
the deterministic `phase4-v1` ruleset:

- target-role match — 25 points;
- target geography — 15 points;
- advertisement recency — 15 points;
- hiring urgency — 15 points;
- company fit — 10 points;
- outsourcing or placement suitability — 10 points;
- data completeness and confidence — 10 points.

Target roles, geographies, preferred industries, and company-fit keywords are
stored in a tenant-scoped, versioned profile. Every score stores the exact job
extraction hash, company enrichment hash, profile version, ruleset version,
component inputs, points, maximums, and plain-language reasons. Changed inputs
mark the displayed score for recalculation.

There is no model call, unexplained AI-generated total, or automatic creation
of a human CRM contact.

## Phase 5 — Review and CRM promotion

Job Leads is the human control surface for single URL, batch URL, and CSV
imports; extraction preview; duplicate warnings; failed-scrape retry; review
and score filters; job and company approval; and explicit CRM promotion.

An approved job and an approved, reviewed company are both required before a
company can be promoted. Promotion is an atomic, tenant-scoped database action
with an immutable event and creates only a `crm_companies` record. Scraping,
enrichment, scoring, and approval never create CRM records as side effects.

A human can be added later only through the verified-contact action. It requires
a real first name, email or phone, an HTTPS verification source, a verification
method, and a written evidence note. Verification evidence is immutable, and
changing an identity field removes the contact's verified state.
