# Job-ad ingestion operations

Phase 1 imports one public job-advertisement URL, extracts structured facts, and
places the result into a tenant-scoped review queue. Approval is bound to both
the source-content hash and normalized extraction hash. Any subsequent change
returns the record to `needs_review`.

Phase 2 adds saved multi-source searches and a deduplicated discovery queue.
SEEK, Indeed, and LinkedIn searches run through bounded Apify actors. Discovery
stores only public job/company metadata; each selected result must still pass
through Phase 1 extraction and human review before later CRM use.
Each run is limited to 50 results and a default maximum Apify charge of USD 1.
`APIFY_DISCOVERY_MAX_CHARGE_USD` may be set from 0.1 to 5.
Phase 1 ingestion has the same default USD 1 ceiling through
`APIFY_INGEST_MAX_CHARGE_USD`.

## Release order

1. Apply `db/migrations/019_job_ad_review_hardening.sql` after migrations 001–018,
   then apply migrations 020 through `db/migrations/022_company_enrichment.sql`.
2. Deploy `job-ad-ingest`, `job-ad-discover`, `company-enrich`, and the retired
   `engine-jobs-scrape` tombstone to project `uerbrkxowbrqadkwbqea`.
3. Configure `APIFY_API_KEY` and `OPENAI_API_KEY` as Supabase Function secrets.
   `OPENAI_EXTRACTION_MODEL` is optional. The scraper defaults to Apify's
   official `apify/website-content-crawler`; `APIFY_WEBSITE_CONTENT_ACTOR` may
   override the actor when required.
4. Deploy the Next.js application only after the database migration and Edge
   Function are available.

Example CLI commands:

```bash
supabase link --project-ref uerbrkxowbrqadkwbqea
supabase db push
supabase secrets set APIFY_API_KEY=... OPENAI_API_KEY=...
supabase functions deploy job-ad-ingest --project-ref uerbrkxowbrqadkwbqea
supabase functions deploy job-ad-discover --project-ref uerbrkxowbrqadkwbqea
supabase functions deploy company-enrich --project-ref uerbrkxowbrqadkwbqea
supabase functions deploy engine-jobs-scrape --project-ref uerbrkxowbrqadkwbqea
```

Never place provider secrets in `NEXT_PUBLIC_*` variables.
Phase 3 uses `APIFY_COMPANY_MAX_CHARGE_USD` with a default USD 1 ceiling and
never writes to `crm_contacts`. See `docs/LEAD-ENGINE-ROADMAP.md`.

## Release verification

- Sign in as a `client_admin` linked to a client.
- Import one individual vacancy with JSON-LD and one without JSON-LD.
- Confirm both records initially have `needs_review`.
- Approve one record and confirm a `job_ad_review_events` row was written.
- Re-import the unchanged page and confirm it remains approved.
- Change a fixture or import a changed source and confirm it returns to review.
- Attempt to review another tenant's job and confirm the API returns `403`.
- Confirm direct authenticated `UPDATE` access to `job_ads` is denied.
- Confirm failed provider calls produce completed `failed` scrape-run records.
- Confirm the Apify run is stopped when the ingestion deadline is exceeded.
- Run one discovery for each enabled source and confirm duplicate URLs are not
  duplicated in `job_discoveries`.
- Import a discovery and confirm it becomes `imported` only after Phase 1 saves
  the matching `job_ads` record.
- Approve a job while a refresh is running and confirm the refresh does not
  overwrite a review that matches the newly extracted hashes.
- Dismiss or import a discovery during a repeated search and confirm its status
  and `job_ad_id` are preserved.

Useful checks:

```sql
SELECT status, count(*)
FROM job_scrape_runs
GROUP BY status;

SELECT status, count(*)
FROM job_ads
GROUP BY status;

SELECT *
FROM job_scrape_runs
WHERE status = 'running'
  AND started_at < now() - interval '15 minutes';
```

## Operating targets

- At least 95% of representative individual-job fixtures accepted.
- No known multi-vacancy listing page accepted as an unambiguous job.
- No cross-tenant reads or review transitions.
- Provider failures recorded with an error code and completion time.
- Any changed approved extraction automatically returned to review.

## Recovery

Each new ingestion reconciles stale `running` records for its client. If the
provider is degraded, stop submitting new imports; existing reviewed data is
not deleted. The review migration is additive and should not be rolled back by
dropping review history. If an application rollback is required, keep migration
019 installed and redeploy the previous application version.
