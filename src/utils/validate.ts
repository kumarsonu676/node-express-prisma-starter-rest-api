import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';
import { asyncHandler } from './asyncHandler';
import { ValidationSchemas } from '../middleware/validate.middleware';
import { validate } from '../middleware/validate.middleware';

export const validateBody = <T extends ZodSchema>(schema: T): RequestHandler => {
  return validate({ body: schema });
};

export const validateQuery = <T extends ZodSchema>(schema: T): RequestHandler => {
  return validate({ query: schema });
};

export const validateParams = <T extends ZodSchema>(schema: T): RequestHandler => {
  return validate({ params: schema });
};

export const validateAll = (schemas: ValidationSchemas): RequestHandler => {
  return validate(schemas);
};
