declare global {
    namespace Express {
        interface Request {
            id?: string;
            requestTime?: Date;
        }
    }
}

export { };
