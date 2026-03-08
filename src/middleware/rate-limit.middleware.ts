import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

const createRateLimitError = (message: string, code: string) => {
  return new AppError(message, 429, code as any, 'RATE_LIMIT' as any, true);
};

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(createRateLimitError('Too many requests, please try again later', 'ERR_RATE_LIMIT_001'));
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(createRateLimitError('Too many auth attempts, please try again later', 'ERR_RATE_LIMIT_002'));
  },
});

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(createRateLimitError('Too many attempts, account temporarily locked', 'ERR_RATE_LIMIT_003'));
  },
});
