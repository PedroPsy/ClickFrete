import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/AppError';
import logger from '../utils/logger';

export interface ValidatedRequest extends Request {
  validatedData?: any;
}

export function validationMiddleware(schema: ZodSchema) {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Validation failed', { errors, body: req.body });

        return res.status(400).json({
          error: 'Validação falhou',
          details: errors,
        });
      }

      req.validatedData = result.data;
      next();
    } catch (error) {
      logger.error('Validation middleware error', { error });
      res.status(500).json({ error: 'Erro ao validar dados' });
    }
  };
}

export function queryValidationMiddleware(schema: ZodSchema) {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          error: 'Validação falhou',
          details: errors,
        });
      }

      req.validatedData = result.data;
      next();
    } catch (error) {
      logger.error('Query validation middleware error', { error });
      res.status(500).json({ error: 'Erro ao validar query' });
    }
  };
}
