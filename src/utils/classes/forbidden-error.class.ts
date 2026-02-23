import { AppError } from "./app-error.class";
import { ErrorCode } from "../enums/error-code.enum";
import { ErrorType } from "../enums/error-type.enum";

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", code: ErrorCode = ErrorCode.FORBIDDEN) {
        super(message, 403, code, ErrorType.AUTHORIZATION);
    }
}
