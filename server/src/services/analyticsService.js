import { RequestLog } from '../models/RequestLog.js';
import { calculateSavingsUSD } from '../utils/mathUtils.js';

class AnalyticsService {
  /**
   * Saves a complete audit record in MongoDB RequestLog.
   */
  static async logRequest({
    prompt,
    cacheHit,
    similarityScore,
    latencyMs,
    piiDetected,
    tokensSaved,
    model
  }) {
    // Calculate cost saved (only applies if it was a cache hit)
    let costSavedUSD = 0;
    if (cacheHit && tokensSaved > 0) {
      // Assuming symmetric input/output token savings for simplicity if we only have total tokens
      // But a more accurate method uses actual prompt/completion token counts from the cached response usage
      // For this API, tokensSaved represents total tokens. Let's assume a 25/75 split for estimation.
      const estimatedPromptTokens = tokensSaved * 0.25;
      const estimatedCompletionTokens = tokensSaved * 0.75;
      costSavedUSD = calculateSavingsUSD(estimatedPromptTokens, estimatedCompletionTokens);
    }

    const logEntry = new RequestLog({
      promptPreview: prompt.substring(0, 100),
      cacheHit,
      similarityScore,
      latencyMs,
      piiDetected,
      tokensSaved,
      costSavedUSD,
      model
    });

    await logEntry.save();
    return logEntry;
  }
}

export default AnalyticsService;
