import { CacheEntry } from '../models/CacheEntry.js';
import { cosineSimilarity } from '../utils/mathUtils.js';

/**
 * Handles vector similarity lookup against MongoDB `CacheEntry` collection.
 */
class CacheService {
  /**
   * Find the entry with the highest cosine similarity to the query embedding.
   * @param {number[]} queryEmbedding 
   * @returns {Promise<{ isHit: boolean, similarity: number, cachedResponse: object|null }>}
   */
  static async checkCache(queryEmbedding) {
    const threshold = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.92');
    
    // For MVP/$0 free tier without Atlas Vector Search enabled, we will perform
    // a basic in-memory cosine similarity calculation against recent entries.
    // In a full production environment with Atlas Vector Search, you would use:
    // { $vectorSearch: { queryVector: queryEmbedding, path: 'embedding', numCandidates: 10, limit: 1 } }
    
    // Fetch recent active cache entries (limit to 1000 for basic memory safety if not using vector search)
    const entries = await CacheEntry.find().sort({ createdAt: -1 }).limit(1000);
    
    let maxSimilarity = -1;
    let bestMatch = null;

    for (const entry of entries) {
      if (entry.embedding && entry.embedding.length === queryEmbedding.length) {
        const sim = cosineSimilarity(queryEmbedding, entry.embedding);
        if (sim > maxSimilarity) {
          maxSimilarity = sim;
          bestMatch = entry;
        }
      }
    }

    if (maxSimilarity >= threshold && bestMatch) {
      // Update hit count and last accessed
      bestMatch.hitCount += 1;
      bestMatch.lastAccessedAt = Date.now();
      await bestMatch.save();

      return {
        isHit: true,
        similarity: maxSimilarity,
        cachedResponse: bestMatch.response
      };
    }

    return {
      isHit: false,
      similarity: maxSimilarity !== -1 ? maxSimilarity : null,
      cachedResponse: null
    };
  }

  /**
   * Saves new record to MongoDB CacheEntry.
   */
  static async saveToCache(prompt, promptSanitized, embedding, response, model, usage) {
    const entry = new CacheEntry({
      prompt,
      promptSanitized,
      embedding,
      response,
      model,
      usage
    });
    
    await entry.save();
    return entry;
  }
}

export default CacheService;
