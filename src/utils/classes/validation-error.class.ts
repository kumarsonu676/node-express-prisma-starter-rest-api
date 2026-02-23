import { AppError } from "./app-error.class";
import { ErrorCode } from "../enums/error-code.enum";
import { ErrorType } from "../enums/error-type.enum";
import { ErrorResponse } from "../interfaces/error-response.interface";

export class ValidationError extends AppError {
    public readonly errors: Record<string, unknown>[];

    constructor(message: string, errors: Record<string, unknown>[], code: ErrorCode = ErrorCode.VALIDATION_ERROR) {
        super(message, 400, code, ErrorType.VALIDATION);
        this.errors = errors;
    }

    toJSON(requestId?: string): ErrorResponse {
        return {
            ...super.toJSON(requestId),
            errors: this.errors,
        };
    }
}
