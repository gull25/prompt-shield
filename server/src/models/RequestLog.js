import mongoose from 'mongoose';

const RequestLogSchema = new mongoose.Schema({
  promptPreview: {
    type: String, // First 100 characters of prompt
    required: true
  },
  cacheHit: {
    type: Boolean,
    required: true
  },
  similarityScore: {
    type: Number,
    default: null
  },
  latencyMs: {
    type: Number,
    required: true
  },
  piiDetected: {
    type: Boolean,
    default: false
  },
  tokensSaved: {
    type: Number,
    default: 0
  },
  costSavedUSD: {
    type: Number,
    default: 0
  },
  model: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries on dashboard
RequestLogSchema.index({ createdAt: -1 });

export const RequestLog = mongoose.model('RequestLog', RequestLogSchema);
