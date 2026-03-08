import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { ValidationError, ErrorCode } from '../utils/errors';

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query);
        req.query = parsedQuery as Request['query'];
      }

      if (schemas.params) {
        const parsedParams = schemas.params.parse(req.params);
        req.params = parsedParams as Request['params'];
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, unknown>[] = error.issues.map((err: ZodIssue) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        next(new ValidationError('Validation failed', errors, ErrorCode.VALIDATION_ERROR));
        return;
      }

      next(error);
    }
  };
};
