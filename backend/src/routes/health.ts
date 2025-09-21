import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

router.get('/ai', async (req, res) => {
  try {
    const { AIService } = await import('../services/aiService.js');
    const greeting = await AIService.generateInitialGreeting();
    
    res.json({
      status: 'healthy',
      aiProvider: process.env.AI_PROVIDER || 'ollama',
      testResponse: greeting,
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
