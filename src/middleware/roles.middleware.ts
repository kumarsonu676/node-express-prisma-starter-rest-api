import { Request, Response, NextFunction } from "express";
import { ForbiddenError, ErrorCode } from "../utils/errors";

type Role = "admin" | "user" | "guest";

export const requireRole = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new ForbiddenError("Authentication required", ErrorCode.FORBIDDEN));
            return;
        }

        const userRole = req.user.role as Role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            next(new ForbiddenError("Insufficient permissions", ErrorCode.INSUFFICIENT_PERMISSIONS));
            return;
        }

        next();
    };
};

export const requireAdmin = requireRole("admin");

export const isAdmin = (req: Request): boolean => {
    return req.user?.role === "admin";
};

export const isAuthenticated = (req: Request): boolean => {
    return !!req.user;
};
