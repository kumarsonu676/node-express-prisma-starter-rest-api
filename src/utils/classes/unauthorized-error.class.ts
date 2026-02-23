import { AppError } from "./app-error.class";
import { ErrorCode } from "../enums/error-code.enum";
import { ErrorType } from "../enums/error-type.enum";

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized", code: ErrorCode = ErrorCode.UNAUTHORIZED) {
        super(message, 401, code, ErrorType.AUTHENTICATION);
    }
}
