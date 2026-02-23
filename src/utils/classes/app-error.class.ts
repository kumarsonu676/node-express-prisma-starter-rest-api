import { ErrorCode } from "../enums/error-code.enum";
import { ErrorType } from "../enums/error-type.enum";
import { ErrorResponse } from "../interfaces/error-response.interface";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code: ErrorCode;
    public readonly type: ErrorType;

    constructor(
        message: string,
        statusCode: number,
        code: ErrorCode = ErrorCode.INTERNAL_ERROR,
        type: ErrorType = ErrorType.INTERNAL,
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.type = type;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(requestId?: string): ErrorResponse {
        return {
            status: "error",
            statusCode: this.statusCode,
            code: this.code,
            type: this.type,
            message: this.message,
            timestamp: new Date().toISOString(),
            requestId,
        };
    }
}
