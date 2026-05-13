import pino from 'pino';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';
import { config } from '../config/env.js';

const isDev = config.NODE_ENV === 'development';

export const logger = pino({
  level: config.LOG_LEVEL,
  base: { service: 'chill-sessions-bot' },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'GROQ_API_KEY',
      'OPENAI_API_KEY',
      'HUGGINGFACE_API_KEY',
    ],
    censor: '[REDACTED]',
  },
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:HH:MM:ss.l' },
        },
      }
    : {}),
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const headerId = req.headers['x-request-id'];
    const id = (Array.isArray(headerId) ? headerId[0] : headerId) || randomUUID();
    res.setHeader('x-request-id', id);
    return id;
  },
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  serializers: {
    req(req) {
      return { id: req.id, method: req.method, url: req.url };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
});
