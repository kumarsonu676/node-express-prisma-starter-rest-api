/// <reference path="../types/global.d.ts" />

import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
  fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
    if (!req.id) {
      req.id = new Date().getTime().toString();
    }
    req.requestTime = new Date();
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
