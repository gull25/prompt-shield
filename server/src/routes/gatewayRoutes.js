import express from 'express';
import { handleChatCompletion, handleGetModels } from '../controllers/gatewayController.js';

const router = express.Router();

router.post('/chat/completions', handleChatCompletion);
router.get('/models', handleGetModels);

export default router;
