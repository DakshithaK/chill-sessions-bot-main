import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { createError } from './errorHandler.js';

export const validateRequest = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate route parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return next(createError(`Validation failed: ${errors.join('; ')}`, 400));
    }

    next();
  };
};

// Common validation schemas
export const schemas = {
  message: Joi.object({
    text: Joi.string().min(1).max(2000).required(),
    sessionId: Joi.string().uuid().optional(),
    userName: Joi.string().min(1).max(100).optional(),
  }),
  
  session: Joi.object({
    sessionId: Joi.string().uuid().required(),
  }),
  
  sessionCreate: Joi.object({
    userName: Joi.string().min(1).max(100).optional(),
  }),
  
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};
