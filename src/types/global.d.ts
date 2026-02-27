import { TokenPayload } from "../utils/auth/jwt.utilz";

declare global {
    namespace Express {
        interface Request {
            id?: string;
            requestTime?: Date;
            user?: TokenPayload;
        }
    }
}

export { };
