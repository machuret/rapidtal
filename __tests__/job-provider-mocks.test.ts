/** @jest-environment node */

import { scrapeWithFirecrawl } from "../lib/firecrawl";
import { parseOpenAiJobExtractionResponse } from "../supabase/functions/_shared/openai-job";

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
});
