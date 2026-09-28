import { redactPII } from '../services/piiService.js';
import EmbeddingService from '../services/embeddingService.js';
import CacheService from '../services/cacheService.js';
import LLMService from '../services/llmService.js';
import AnalyticsService from '../services/analyticsService.js';

export const handleChatCompletion = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { model, messages, temperature, max_tokens } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // 1. Extract the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || !latestMessage.content) {
      return res.status(400).json({ error: 'Valid message content is required' });
    }
    
    const originalPrompt = latestMessage.content;

    // 2. PII Redaction
    const { sanitizedText, piiDetected, redactedTypes } = redactPII(originalPrompt);
    
    // Temporarily replace the user's message with the sanitized one for embedding/upstream
    messages[messages.length - 1].content = sanitizedText;

    // 3. Compute local embedding
    const queryEmbedding = await EmbeddingService.generateEmbedding(sanitizedText);

    // 4. Check Semantic Cache
    const cacheResult = await CacheService.checkCache(queryEmbedding);

    let finalResponse;
    let cacheHit = cacheResult.isHit;
    let similarityScore = cacheResult.similarity;
    let tokensSaved = 0;

    if (cacheHit) {
      // Return cached response
      finalResponse = cacheResult.cachedResponse;
      if (finalResponse.usage && finalResponse.usage.total_tokens) {
        tokensSaved = finalResponse.usage.total_tokens;
      }
    } else {
      // MISS: Forward to upstream LLM
      finalResponse = await LLMService.getCompletion(messages, model, temperature, max_tokens);
      
      // Store in vector cache
      const usage = {
        promptTokens: finalResponse.usage?.prompt_tokens || 0,
        completionTokens: finalResponse.usage?.completion_tokens || 0,
        totalTokens: finalResponse.usage?.total_tokens || 0
      };
      
      await CacheService.saveToCache(
        originalPrompt, 
        sanitizedText, 
        queryEmbedding, 
        finalResponse, 
        model || process.env.DEFAULT_MODEL,
        usage
      );
    }

    const latencyMs = Date.now() - startTime;

    // 5. Log Analytics
    const logEntry = await AnalyticsService.logRequest({
      prompt: originalPrompt,
      cacheHit,
      similarityScore,
      latencyMs,
      piiDetected,
      tokensSaved,
      model: model || process.env.DEFAULT_MODEL
    });

    // 6. Return OpenAI compatible response with custom headers
    res.set({
      'x-promptshield-cache-hit': cacheHit,
      'x-promptshield-similarity': similarityScore,
      'x-promptshield-latency-ms': latencyMs,
      'x-promptshield-pii-detected': piiDetected
    });
    
    // Inject custom metadata into the response body as per spec
    finalResponse.x_promptshield = {
      cache_hit: cacheHit,
      similarity_score: similarityScore,
      latency_ms: latencyMs,
      estimated_cost_saved_usd: logEntry.costSavedUSD,
      pii_detected: piiDetected,
      redacted_types: redactedTypes
    };

    return res.status(200).json(finalResponse);

  } catch (error) {
    console.error('Gateway Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const handleGetModels = (req, res) => {
  res.json({
    object: 'list',
    data: [
      {
        id: process.env.DEFAULT_MODEL || 'llama-3.3-70b-versatile',
        object: 'model',
        created: 1700000000,
        owned_by: 'groq'
      }
    ]
  });
};
