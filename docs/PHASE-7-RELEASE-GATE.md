# Phase 7 release gate

Phase 7 must pass before the job-lead pipeline is released.

## Automated checks

Run:

```bash
pnpm test
pnpm lint
pnpm build
```

The fixture suite in `__tests__/fixtures/job-ads` covers:

- complete JSON-LD;
- JavaScript-rendered content requiring AI extraction;
- incomplete content that must not be filled with invented facts; and
- expired advertisements.

Firecrawl and OpenAI responses are mocked. The live job-ad ingestion path uses
Apify plus OpenAI; its Apify adapter has a separate bounded-response suite.

The database behavior test is `db/tests/phase7_behavior.sql`. Run it against a
fresh database after migrations 001–029. It verifies:

- repeated ingestion leaves one job per tenant and canonical URL;
- repeated enrichment leaves one company per tenant and normalized domain;
- provider errors and three-failures-per-hour escalation create alerts; and
- one tenant cannot read another tenant's jobs or alerts;
- expired advertisements enter and remain in the expired lifecycle; and
- accuracy is computed by the database without accepting cross-tenant provenance.

## Metrics

The Job Leads health panel reports terminal runs from the previous 24 hours:

- success rate;
- average latency;
- provider cost plus estimated AI cost; and
- field-weighted extraction accuracy from labeled samples in the previous
  30 days.

Accuracy is displayed as `Not measured` when no labeled fixture or reviewed
sample exists. Operational success is never presented as extraction accuracy.
Authorized client administrators and super administrators can submit labeled
fixture or production samples through `POST /api/job-leads/quality-measurements`.
The database calculates matching fields and the score; callers cannot submit
their own score.

AI cost uses the token counts returned by OpenAI. Default input and output
rates can be overridden with:

- `OPENAI_EXTRACTION_INPUT_USD_PER_MILLION`
- `OPENAI_EXTRACTION_OUTPUT_USD_PER_MILLION`

Update these when the configured extraction model or provider pricing changes.

## Alerts

A failed ingestion, discovery, or company-enrichment run creates a warning.
Three failures for the same tenant and provider within 60 minutes create a
critical repeated-failure alert. OpenAI extraction errors are attributed to
OpenAI rather than the page-fetch provider.

Open alerts are visible and acknowledgeable on Job Leads. Alert context stores
only the run ID, error code, and recent count; it does not copy provider
credentials, submitted URLs, or raw error messages.

If any metrics or alert query fails, Job Leads displays an explicit
`Observability data is incomplete` warning. Missing monitoring data must never
be interpreted as a healthy zero.
