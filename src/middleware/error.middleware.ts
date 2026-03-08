import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, ErrorCode, ErrorType } from '../utils/errors';
import { handlePrismaError, isPrismaError } from '../utils/prisma-error-handler';
import { logger } from '../utils/logger';
import appConfig from '../config/app.config';

interface ZodError {
  name?: string;
  errors?: unknown[];
}

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.id;

  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = ErrorCode.INTERNAL_ERROR;
  let type = ErrorType.INTERNAL;
  let errors: Record<string, unknown>[] | undefined;
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    type = err.type;
    isOperational = err.isOperational;

    if (err instanceof ValidationError) {
      errors = err.errors;
    }
  } else if (isPrismaError(err)) {
    const prismaError = handlePrismaError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;
    code = prismaError.code;
    type = prismaError.type;
    isOperational = prismaError.isOperational;

    if (prismaError instanceof ValidationError) {
      errors = prismaError.errors;
    }
  } else if ((err as ZodError).name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    code = ErrorCode.VALIDATION_ERROR;
    type = ErrorType.VALIDATION;
    errors = ((err as ZodError).errors || []) as Record<string, unknown>[];
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = ErrorCode.INVALID_TOKEN;
    type = ErrorType.AUTHENTICATION;
    isOperational = true;
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = ErrorCode.TOKEN_EXPIRED;
    type = ErrorType.AUTHENTICATION;
    isOperational = true;
  }

  const logLevel = statusCode >= 500 ? 'error' : 'warn';
  const logMeta = {
    requestId,
    method: req.method,
    url: req.url,
    statusCode,
    code,
    type,
    isOperational,
    ...(req.requestTime && { requestTime: req.requestTime }),
  };

  if (statusCode >= 500) {
    logger[logLevel](`[${req.method}] ${req.url} - ${statusCode} - ${message}`, {
      ...logMeta,
      stack: err.stack,
    });
  } else {
    logger[logLevel](`[${req.method}] ${req.url} - ${statusCode} - ${message}`, logMeta);
  }

  const response: Record<string, unknown> = {
    status: 'error',
    statusCode,
    code,
    type,
    message: isOperational || !appConfig.environment.isProduction ? message : 'An error occurred',
    timestamp: new Date().toISOString(),
    requestId,
  };

  if (errors) {
    response.errors = errors;
  }

  if (appConfig.environment.isDevelopment && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
