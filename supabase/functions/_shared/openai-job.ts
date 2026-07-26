import { estimateAiCostUsd, type AiTokenUsage } from "./job-cost.ts";
import { normalizeAiExtraction, type JobAdExtraction } from "./job-ad.ts";

export type ParsedOpenAiJobExtraction = {
  extraction: JobAdExtraction;
  tokensUsed: number;
  estimatedCostUsd: number;
};

export class OpenAiJobRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OpenAiJobRequestError";
    this.status = status;
  }
}

type OpenAiJobRequest = {
  apiKey: string;
  model: string;
  schema: Record<string, unknown>;
  prompt: string;
  sourceUrl: string;
  pageContent: string;
  structuredContext?: unknown;
  inputUsdPerMillion?: number;
  outputUsdPerMillion?: number;
};

export async function requestOpenAiJobExtraction(
  fetcher: (url: string, init: RequestInit) => Promise<Response>,
  request: OpenAiJobRequest,
): Promise<ParsedOpenAiJobExtraction> {
  const structuredContext = request.structuredContext
    ? `Already parsed structured data:\n${JSON.stringify(request.structuredContext)}\n\n`
    : "";
  const response = await fetcher("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${request.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      response_format: {
        type: "json_schema",
        json_schema: request.schema,
      },
      temperature: 0,
      max_tokens: 5000,
      messages: [
        { role: "system", content: request.prompt },
        {
          role: "user",
          content: `${structuredContext}Source URL: ${request.sourceUrl}\n\nWEBPAGE:\n${request.pageContent.slice(0, 35_000)}`,
        },
      ],
    }),
  });
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok) {
    const error = payload?.error;
    const message = error && typeof error === "object" && !Array.isArray(error)
      && typeof (error as Record<string, unknown>).message === "string"
      ? String((error as Record<string, unknown>).message)
      : `OpenAI returned HTTP ${response.status}`;
    throw new OpenAiJobRequestError(message, response.status);
  }
  return parseOpenAiJobExtractionResponse(
    payload,
    request.inputUsdPerMillion,
    request.outputUsdPerMillion,
  );
}

export function parseOpenAiJobExtractionResponse(
  payload: unknown,
  inputUsdPerMillion = 0.15,
  outputUsdPerMillion = 0.6,
): ParsedOpenAiJobExtraction {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("OpenAI returned an invalid response envelope.");
  }
  const envelope = payload as Record<string, unknown>;
  const choices = Array.isArray(envelope.choices) ? envelope.choices : [];
  const first = choices[0];
  const message = first && typeof first === "object" && !Array.isArray(first)
    ? (first as Record<string, unknown>).message
    : null;
  const content = message && typeof message === "object" && !Array.isArray(message)
    ? (message as Record<string, unknown>).content
    : null;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("OpenAI returned no extraction content.");
  }

  const usage = envelope.usage && typeof envelope.usage === "object"
    ? envelope.usage as AiTokenUsage
    : undefined;
  return {
    extraction: normalizeAiExtraction(JSON.parse(content)),
    tokensUsed: Number(usage?.total_tokens ?? 0) || 0,
    estimatedCostUsd: estimateAiCostUsd(usage, inputUsdPerMillion, outputUsdPerMillion),
  };
}
