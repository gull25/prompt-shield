import express from 'express';
import { getOverview, getLogs, getCacheEntries, flushCache, testPlayground } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/overview', getOverview);
router.get('/logs', getLogs);
router.get('/cache/entries', getCacheEntries);
router.delete('/cache', flushCache);
router.post('/test/playground', testPlayground);

export default router;
