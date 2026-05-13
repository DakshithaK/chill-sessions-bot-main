import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { config } from './config/env.js';
import { logger, httpLogger } from './lib/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import chatRoutes from './routes/chat.js';
import healthRoutes from './routes/health.js';
import { initializeDatabase } from './database/init.js';

export const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  })
);

const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(compression());
app.use(httpLogger);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: { message: `Cannot ${req.method} ${req.originalUrl}` },
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    await initializeDatabase();
    logger.info('Database initialized');

    app.listen(config.PORT, () => {
      logger.info(
        { port: config.PORT, frontendUrl: config.FRONTEND_URL, env: config.NODE_ENV },
        'Server running'
      );
    });
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

let dbInitialized = false;
async function ensureDatabaseInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

if (process.env.VERCEL) {
  ensureDatabaseInitialized().catch((err) => logger.error({ err }, 'DB init failed (vercel)'));
}

if (!process.env.VERCEL && config.NODE_ENV !== 'test') {
  startServer();
}

export default app;
