/// <reference path="../types/global.d.ts" />

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth/jwt.util";
import { UnauthorizedError, ErrorCode, ForbiddenError } from "../utils/errors";
import { RoleName } from "../modules/auth/auth.types";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("No token provided", ErrorCode.UNAUTHORIZED);
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);

        req.user = payload;
        next();
    } catch (error) {
        next(error);
    }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const payload = verifyAccessToken(token);
            req.user = payload;
        }
    } catch {
        // Ignore errors for optional auth
    }
    next();
};


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