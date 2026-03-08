import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, ErrorCode } from '../utils/errors';
import { RoleName } from '../modules/auth/auth.types';

export const requireRole = (...allowedRoles: RoleName[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required', ErrorCode.FORBIDDEN));
      return;
    }

    const userRoles = req.user.roles as RoleName[];

    if (!userRoles || !userRoles.some((role) => allowedRoles.includes(role))) {
      next(new ForbiddenError('Insufficient permissions', ErrorCode.INSUFFICIENT_PERMISSIONS));
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(RoleName.ADMIN);

export const isAdmin = (req: Request): boolean => {
  return req.user?.roles?.includes(RoleName.ADMIN) ?? false;
};

export const isAuthenticated = (req: Request): boolean => {
  return !!req.user;
};
