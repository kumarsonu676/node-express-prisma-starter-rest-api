import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, ErrorCode } from '../../utils/errors';
import type { RoleName } from './auth.types';

export const authorizeRoles = (...allowedRoles: RoleName[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required', ErrorCode.FORBIDDEN));
      return;
    }

    const userRoles = req.user.roles as RoleName[];

    const hasAllowedRole = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasAllowedRole) {
      next(new ForbiddenError('Insufficient permissions', ErrorCode.INSUFFICIENT_PERMISSIONS));
      return;
    }

    next();
  };
};
