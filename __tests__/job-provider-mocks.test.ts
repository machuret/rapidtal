/** @jest-environment node */

import { scrapeWithFirecrawl } from "../lib/firecrawl";
import {
  OpenAiJobRequestError,
  parseOpenAiJobExtractionResponse,
  requestOpenAiJobExtraction,
} from "../supabase/functions/_shared/openai-job";

describe("Phase 7 provider mocks", () => {
  const originalApiKey = process.env.FIRECRAWL_API_KEY;

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalApiKey === undefined) delete process.env.FIRECRAWL_API_KEY;
    else process.env.FIRECRAWL_API_KEY = originalApiKey;
  });

  test("mocks a successful Firecrawl rendered-page response", async () => {
    process.env.FIRECRAWL_API_KEY = "test-only";
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        success: true,
        data: {
          markdown: "# Sales Director\nBuild and lead the sales function.",
          html: "<main><h1>Sales Director</h1></main>",
        },
      }), { status: 200 }),
    );

    const result = await scrapeWithFirecrawl({
      url: "https://jobs.example.com/fixtures/dynamic",
    });

    expect(result.success).toBe(true);
    expect(result.data?.markdown).toContain("Sales Director");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.firecrawl.dev/v1/scrape",
      expect.objectContaining({ method: "POST" }),
    );
    const request = fetchMock.mock.calls[0][1]!;
    expect(JSON.parse(String(request.body))).toMatchObject({
      url: "https://jobs.example.com/fixtures/dynamic",
      formats: ["markdown", "html"],
    });
  });

  test("mocks provider errors without leaking the API credential", async () => {
    process.env.FIRECRAWL_API_KEY = "secret-test-token";
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "provider unavailable" }), { status: 503 }),
    );
    const result = await scrapeWithFirecrawl({ url: "https://jobs.example.com/role" });
    expect(result).toEqual({
      success: false,
      error: "provider unavailable",
      code: 503,
    });
    expect(JSON.stringify(result)).not.toContain("secret-test-token");
  });

  test("rejects malformed mocked AI responses", () => {
    expect(() => parseOpenAiJobExtractionResponse({ choices: [] })).toThrow(
      "OpenAI returned no extraction content.",
    );
    expect(() => parseOpenAiJobExtractionResponse({
      choices: [{ message: { content: "not json" } }],
    })).toThrow();
  });

  test("mocks the actual OpenAI transport contract used by ingestion", async () => {
    const fetcher = jest.fn().mockResolvedValue(new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            is_job_ad: true,
            title: "Sales Manager",
            description: "Lead a national sales team and own sustainable revenue growth across the Australian market.",
          }),
        },
      }],
      usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    }), { status: 200 }));

    const result = await requestOpenAiJobExtraction(fetcher, {
      apiKey: "test-openai-key",
      model: "fixture-model",
      schema: { name: "fixture-schema", strict: true, schema: { type: "object" } },
      prompt: "Extract only supported facts.",
      sourceUrl: "https://jobs.example.com/role/42",
      pageContent: "Rendered job page content",
    });

    expect(result.extraction.title).toBe("Sales Manager");
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({ method: "POST" }),
    );
    const init = fetcher.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      model: "fixture-model",
      temperature: 0,
      max_tokens: 5000,
      response_format: {
        type: "json_schema",
        json_schema: { name: "fixture-schema", strict: true },
      },
    });
    expect(body.messages[1].content).toContain("https://jobs.example.com/role/42");
    expect(String((init.headers as Record<string, string>).Authorization))
      .toBe("Bearer test-openai-key");
  });

  test("surfaces mocked OpenAI HTTP failures with their provider status", async () => {
    const fetcher = jest.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { message: "rate limited" },
    }), { status: 429 }));
    await expect(requestOpenAiJobExtraction(fetcher, {
      apiKey: "test-openai-key",
      model: "fixture-model",
      schema: { name: "fixture-schema" },
      prompt: "Extract.",
      sourceUrl: "https://jobs.example.com/role/42",
      pageContent: "Rendered content",
    })).rejects.toMatchObject<Partial<OpenAiJobRequestError>>({
      message: "rate limited",
      status: 429,
    });
  });
});
