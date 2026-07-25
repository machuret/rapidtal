# Job-ad ingestion operations

Phase 1 imports one public job-advertisement URL, extracts structured facts, and
places the result into a tenant-scoped review queue. Approval is bound to both
the source-content hash and normalized extraction hash. Any subsequent change
returns the record to `needs_review`.

## Release order

1. Apply `db/migrations/019_job_ad_review_hardening.sql` after migrations 001–018.
2. Deploy the `job-ad-ingest` Supabase Edge Function to project
   `uerbrkxowbrqadkwbqea`.
3. Configure `FIRECRAWL_API_KEY` and `OPENAI_API_KEY` as Supabase Function
   secrets. `OPENAI_EXTRACTION_MODEL` is optional.
4. Deploy the Next.js application only after the database migration and Edge
   Function are available.

Example CLI commands:

```bash
supabase link --project-ref uerbrkxowbrqadkwbqea
supabase db push
supabase secrets set FIRECRAWL_API_KEY=... OPENAI_API_KEY=...
supabase functions deploy job-ad-ingest --project-ref uerbrkxowbrqadkwbqea
```

Never place provider secrets in `NEXT_PUBLIC_*` variables.

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
