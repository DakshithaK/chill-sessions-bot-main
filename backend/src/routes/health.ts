import { Router } from 'express';
import { config } from '../config/env.js';
import { dbGet } from '../database/init.js';
import { logger } from '../lib/logger.js';

const router = Router();

// Liveness — process is up. Cheap, doesn't touch dependencies.
router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// Readiness — dependencies are usable.
router.get('/ready', async (_req, res) => {
  const checks: Record<string, { ok: boolean; detail?: string }> = {};

  try {
    await dbGet('SELECT 1 AS ok');
    checks.database = { ok: true };
  } catch (err) {
    checks.database = { ok: false, detail: err instanceof Error ? err.message : 'unknown' };
  }

  const keyEnv = {
    groq: config.GROQ_API_KEY,
    openai: config.OPENAI_API_KEY,
    huggingface: config.HUGGINGFACE_API_KEY,
    ollama: 'n/a',
  }[config.AI_PROVIDER];
  checks.aiProvider = keyEnv
    ? { ok: true, detail: config.AI_PROVIDER }
    : { ok: false, detail: `missing key for ${config.AI_PROVIDER}` };

  const allOk = Object.values(checks).every((c) => c.ok);
  if (!allOk) logger.warn({ checks }, 'Readiness check failed');
  res.status(allOk ? 200 : 503).json({ status: allOk ? 'ok' : 'degraded', checks });
});

export default router;
