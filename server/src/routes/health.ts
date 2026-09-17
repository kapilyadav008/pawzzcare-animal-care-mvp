import { Router } from 'express';
import mongoose from 'mongoose';
import { config } from '../config.js';

const router = Router();

router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const hasGeminiKey = Boolean(config.geminiApiKey);

  res.json({
    status: 'ok',
    service: 'PawzzCare Backend API',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    aiMode: hasGeminiKey ? 'Gemini 2.5 Active' : 'Fallback AI Mode (Demo)',
    version: '1.0.0'
  });
});

export default router;
