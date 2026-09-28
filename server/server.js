import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import EmbeddingService from './src/services/embeddingService.js';
import gatewayRoutes from './src/routes/gatewayRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1', gatewayRoutes);
app.use('/api', dashboardRoutes); // Using /api for dashboard to separate from /v1 proxy

// Basic health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Graceful startup
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    
    // 2. Pre-warm the embedding model so the first user query doesn't lag
    console.log('Pre-warming Embedding Engine...');
    await EmbeddingService.getInstance();

    // 3. Start listening
    app.listen(PORT, () => {
      console.log(`\n==============================================`);
      console.log(`🚀 PromptShield Gateway running on port ${PORT}`);
      console.log(`🛡️  Ready to intercept & cache LLM queries`);
      console.log(`==============================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
