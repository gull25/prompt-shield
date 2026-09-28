import { pipeline, env } from '@xenova/transformers';

// Disable downloading from Hugging Face if you have it locally, but we need to download it on first run
env.allowLocalModels = false; 
env.useBrowserCache = false;

// Singleton pattern for the embedding pipeline
class EmbeddingEngine {
  static instance = null;

  static async getInstance() {
    if (this.instance === null) {
      console.log('Loading embedding model: all-MiniLM-L6-v2 (this may take a moment on first run)...');
      // Initialize the feature extraction pipeline
      this.instance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: true // Use INT8 quantized model for faster CPU inference
      });
      console.log('Embedding model loaded successfully.');
    }
    return this.instance;
  }

  static async embed(text) {
    try {
      const extractor = await this.getInstance();
      
      // Perform feature extraction
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      
      // Output is a Tensor. We need to convert it to a standard JS array
      // The output tensor data is a Float32Array
      return Array.from(output.data);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
}

export default EmbeddingEngine;
