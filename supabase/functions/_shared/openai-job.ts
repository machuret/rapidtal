import { estimateAiCostUsd, type AiTokenUsage } from "./job-cost.ts";
import { normalizeAiExtraction, type JobAdExtraction } from "./job-ad.ts";

export type ParsedOpenAiJobExtraction = {
  extraction: JobAdExtraction;
  tokensUsed: number;
  estimatedCostUsd: number;
};

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
