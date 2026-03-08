import { TokenPayload } from '../utils/auth/jwt.util';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      requestTime?: Date;
      user?: TokenPayload;
    }
  }
}

export {};
