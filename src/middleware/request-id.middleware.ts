/// <reference path="../types/global.d.ts" />

import { Request, Response, NextFunction } from "express";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    req.id = req.headers["x-request-id"] as string || new Date().getTime().toString();
    req.requestTime = new Date();
    res.setHeader("X-Request-ID", req.id || "");
    next();
};
