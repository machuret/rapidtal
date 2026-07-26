export type AiTokenUsage = {
  prompt_tokens?: unknown;
  completion_tokens?: unknown;
  total_tokens?: unknown;
};

function nonNegativeNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function estimateAiCostUsd(
  usage: AiTokenUsage | null | undefined,
  inputUsdPerMillion = 0.15,
  outputUsdPerMillion = 0.6,
): number {
  const promptTokens = nonNegativeNumber(usage?.prompt_tokens);
  const completionTokens = nonNegativeNumber(usage?.completion_tokens);
  const totalTokens = nonNegativeNumber(usage?.total_tokens);
  const knownTokens = promptTokens + completionTokens;
  const unclassifiedTokens = Math.max(0, totalTokens - knownTokens);
  const estimate = (
    promptTokens * nonNegativeNumber(inputUsdPerMillion)
    + completionTokens * nonNegativeNumber(outputUsdPerMillion)
    + unclassifiedTokens * nonNegativeNumber(inputUsdPerMillion)
  ) / 1_000_000;
  return Math.round(estimate * 1_000_000) / 1_000_000;
}
