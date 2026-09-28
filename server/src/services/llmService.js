import Groq from 'groq-sdk';

class LLMService {
  constructor() {
    this.groq = null;
    this.defaultModel = process.env.DEFAULT_MODEL || 'llama-3.3-70b-versatile';
  }

  init() {
    if (!this.groq && process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
  }

  /**
   * Dispatches sanitized messages to llama-3.3-70b-versatile.
   */
  async getCompletion(messages, model = this.defaultModel, temperature = 0.7, maxTokens = null) {
    this.init();
    
    if (!this.groq) {
      throw new Error('GROQ_API_KEY is missing. Cannot route cache miss to upstream LLM.');
    }

    const options = {
      messages,
      model,
      temperature,
    };
    
    if (maxTokens) {
      options.max_tokens = maxTokens;
    }

    try {
      const chatCompletion = await this.groq.chat.completions.create(options);
      return chatCompletion;
    } catch (error) {
      console.error('Error fetching completion from Groq:', error);
      throw error;
    }
  }
}

export default new LLMService();
