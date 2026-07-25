/** @jest-environment node */

import {
  canonicalizePublicJobUrl,
  determineReviewStatus,
  mergeJobExtractions,
  normalizeAiExtraction,
  parseJobPostingJsonLd,
  validateJobExtraction,
} from "../supabase/functions/_shared/job-ad";

describe("job-ad extraction", () => {
  test("canonicalizes public HTTPS URLs and removes tracking", () => {
    const result = canonicalizePublicJobUrl(
      "https://Jobs.Example.com/vacancy/123?utm_source=mail&job=123#apply",
    );

    expect(result).toEqual({
      canonicalUrl: "https://jobs.example.com/vacancy/123?job=123",
      fetchUrl: "https://jobs.example.com/vacancy/123?utm_source=mail&job=123",
      hostname: "jobs.example.com",
    });
  });

  test("keeps functional source parameters but removes credentials from storage URLs", () => {
    const result = canonicalizePublicJobUrl(
      "https://jobs.example.com/apply/123?source=partner&access_token=secret",
    );

    expect(result).toEqual({
      canonicalUrl: "https://jobs.example.com/apply/123?source=partner",
      fetchUrl: "https://jobs.example.com/apply/123?source=partner&access_token=secret",
      hostname: "jobs.example.com",
    });
  });

  test.each([
    "http://jobs.example.com/123",
    "https://localhost/jobs/123",
    "https://127.0.0.1/jobs/123",
    "https://10.0.0.1/jobs/123",
    "https://intranet.internal/jobs/123",
    "not-a-url",
  ])("rejects unsafe URL %s", (url) => {
    expect(canonicalizePublicJobUrl(url)).toBeNull();
  });

  test("extracts nested JobPosting JSON-LD", () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "Organization", "name": "Example" },
                {
                  "@type": "JobPosting",
                  "identifier": { "value": "JOB-42" },
                  "title": "Senior Account Executive",
                  "hiringOrganization": {
                    "@type": "Organization",
                    "name": "Acme Pty Ltd",
                    "sameAs": "https://acme.example/"
                  },
                  "description": "<p>Own the full sales cycle, build lasting customer relationships across Australia, and coordinate commercial strategy with the wider leadership team.</p>",
                  "employmentType": ["FULL_TIME"],
                  "datePosted": "2026-07-20",
                  "validThrough": "2026-08-20T23:59:59+10:00",
                  "jobLocation": {
                    "@type": "Place",
                    "address": {
                      "addressLocality": "Sydney",
                      "addressRegion": "NSW",
                      "addressCountry": "AU"
                    }
                  },
                  "baseSalary": {
                    "@type": "MonetaryAmount",
                    "currency": "AUD",
                    "value": {
                      "@type": "QuantitativeValue",
                      "minValue": 90000,
                      "maxValue": 120000,
                      "unitText": "YEAR"
                    }
                  },
                  "skills": ["B2B sales", "CRM"],
                  "responsibilities": ["Own the full sales cycle", "Build pipeline"],
                  "url": "https://jobs.example.com/JOB-42"
                }
              ]
            }
          </script>
        </head>
      </html>
    `;

    const result = parseJobPostingJsonLd(html);

    expect(result).toMatchObject({
      is_job_ad: true,
      source_job_id: "JOB-42",
      title: "Senior Account Executive",
      company_name: "Acme Pty Ltd",
      company_website: "https://acme.example/",
      location: "Sydney, NSW, AU",
      remote_type: "onsite",
      employment_type: "FULL_TIME",
      salary_min: 90000,
      salary_max: 120000,
      salary_currency: "AUD",
      salary_period: "year",
      skills: ["B2B sales", "CRM"],
      responsibilities: ["Own the full sales cycle", "Build pipeline"],
      apply_url: "https://jobs.example.com/JOB-42",
    });
    expect(result?.posted_at).toBe("2026-07-20T00:00:00.000Z");
    expect(result?.confidence).toBeGreaterThanOrEqual(0.9);
    expect(validateJobExtraction(result!)).toBeNull();
  });

  test("ignores malformed JSON-LD and uses a later valid block", () => {
    const html = `
      <script type="application/ld+json">{bad json}</script>
      <script type="application/ld+json">
        {
          "@type": "JobPosting",
          "title": "Operations Manager",
          "description": "Lead the operations function, improve systems, and manage a distributed delivery team.",
          "hiringOrganization": { "name": "Example Operations" }
        }
      </script>
    `;

    expect(parseJobPostingJsonLd(html)).toMatchObject({
      title: "Operations Manager",
      company_name: "Example Operations",
    });
  });

  test("matches the requested vacancy when a page contains multiple JobPosting records", () => {
    const html = `
      <script type="application/ld+json">
        [
          {
            "@type": "JobPosting",
            "title": "First vacancy",
            "description": "A sufficiently detailed description for the first vacancy advertised on this page.",
            "url": "https://jobs.example.com/jobs/first"
          },
          {
            "@type": "JobPosting",
            "title": "Matched vacancy",
            "description": "A sufficiently detailed description for the vacancy that matches the requested URL.",
            "url": "https://jobs.example.com/jobs/matched"
          }
        ]
      </script>
    `;

    expect(parseJobPostingJsonLd(html)).toBeNull();
    expect(parseJobPostingJsonLd(html, "https://jobs.example.com/jobs/matched")).toMatchObject({
      title: "Matched vacancy",
      apply_url: "https://jobs.example.com/jobs/matched",
    });
  });

  test("normalizes AI values and merges without replacing structured facts", () => {
    const structured = parseJobPostingJsonLd(`
      <script type="application/ld+json">
        {
          "@type": "JobPosting",
          "title": "Sales Manager",
          "description": "Manage the national sales team and own revenue performance across all major accounts.",
          "hiringOrganization": { "name": "Structured Company" }
        }
      </script>
    `);
    const ai = normalizeAiExtraction({
      is_job_ad: true,
      title: "Different AI Title",
      company_name: "Different AI Company",
      location: "Melbourne, VIC",
      remote_type: "hybrid",
      employment_type: "Full-time",
      description: "An AI description that should not replace the structured description.",
      responsibilities: ["Coach the sales team"],
      skills: ["Leadership", "Forecasting"],
      apply_url: "https://jobs.example.com/apply/1",
      field_evidence: { location: "Melbourne VIC — hybrid" },
    });

    const result = mergeJobExtractions(structured, ai);

    expect(result.method).toBe("json_ld+ai");
    expect(result.data.title).toBe("Sales Manager");
    expect(result.data.company_name).toBe("Structured Company");
    expect(result.data.location).toBe("Melbourne, VIC");
    expect(result.data.remote_type).toBe("hybrid");
    expect(result.data.skills).toEqual(["Leadership", "Forecasting"]);
  });

  test("rejects pages that are not individual job advertisements", () => {
    const extraction = normalizeAiExtraction({
      is_job_ad: false,
      title: "Careers",
      description: "Browse all of our current vacancies and learn more about working with us.",
    });

    expect(validateJobExtraction(extraction)).toBe(
      "The supplied page does not appear to be a job advertisement.",
    );
  });

  test("rejects an expiry date earlier than the posting date", () => {
    const extraction = normalizeAiExtraction({
      is_job_ad: true,
      title: "Operations Manager",
      description: "Lead the operations function, improve systems, and manage a distributed delivery team.",
      posted_at: "2026-08-20",
      expires_at: "2026-07-20",
    });

    expect(validateJobExtraction(extraction)).toBe("The extracted job dates are inconsistent.");
  });

  test("requires renewed review when approved content or extraction changes", () => {
    const unchanged = determineReviewStatus({
      existingStatus: "approved",
      currentContentHash: "content-a",
      currentExtractionHash: "extraction-a",
      previousContentHash: "content-a",
      previousExtractionHash: "extraction-a",
      reviewedContentHash: "content-a",
      reviewedExtractionHash: "extraction-a",
    });
    const changed = determineReviewStatus({
      existingStatus: "approved",
      currentContentHash: "content-b",
      currentExtractionHash: "extraction-a",
      previousContentHash: "content-a",
      previousExtractionHash: "extraction-a",
      reviewedContentHash: "content-a",
      reviewedExtractionHash: "extraction-a",
    });

    expect(unchanged).toBe("approved");
    expect(changed).toBe("needs_review");
  });
});
