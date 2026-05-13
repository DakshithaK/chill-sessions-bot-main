import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';
import { logger } from '../lib/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (error: AppError, req: Request, res: Response, _next: NextFunction) => {
  let { statusCode = 500, message } = error;

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (error.name === 'SyntaxError' && 'body' in error) {
    statusCode = 400;
    message = 'Invalid JSON format';
  }

  const requestId = (req as Request & { id?: string }).id;

  logger.error(
    {
      err: error,
      url: req.url,
      method: req.method,
      statusCode,
      requestId,
    },
    'Request error'
  );

  // Never leak internal 5xx messages to clients
  if (statusCode === 500) {
    message = 'Internal server error';
  }

  const body: Record<string, unknown> = { error: { message, requestId } };
  if (config.NODE_ENV === 'development' && error.stack) {
    (body.error as Record<string, unknown>).stack = error.stack;
  }
  res.status(statusCode).json(body);
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
