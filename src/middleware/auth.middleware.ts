import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/auth/jwt.util";
import { UnauthorizedError, ErrorCode } from "../utils/errors";

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

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
