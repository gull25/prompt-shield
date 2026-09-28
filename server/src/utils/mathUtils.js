/**
 * Computes the cosine similarity between two numeric vectors.
 * Returns a value between -1.0 and 1.0 (closer to 1.0 means more similar).
 */
export function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculates estimated USD savings based on standard API rates.
 * Default rates: Llama 3.3 70B (approx $0.00 / Groq free tier, but we use typical 
 * industry benchmarks for the dashboard to show "value saved": 
 * $2.50 per 1M prompt tokens, $10.00 per 1M completion tokens)
 */
export function calculateSavingsUSD(promptTokens, completionTokens) {
  const promptCost = (promptTokens / 1_000_000) * 2.50;
  const completionCost = (completionTokens / 1_000_000) * 10.00;
  return promptCost + completionCost;
}
