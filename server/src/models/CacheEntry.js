import mongoose from 'mongoose';

const CacheEntrySchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true
  },
  promptSanitized: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 384;
      },
      message: 'Embedding must be a 384-dimensional array'
    }
  },
  response: {
    type: Object,
    required: true
  },
  model: {
    type: String,
    default: 'llama-3.3-70b-versatile'
  },
  usage: {
    promptTokens: Number,
    completionTokens: Number,
    totalTokens: Number
  },
  hitCount: {
    type: Number,
    default: 0
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a vector search index using MongoDB Atlas if supported, otherwise standard index
CacheEntrySchema.index({ createdAt: -1 });

export const CacheEntry = mongoose.model('CacheEntry', CacheEntrySchema);
