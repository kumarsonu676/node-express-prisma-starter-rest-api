import { AppError } from "./app-error.class";
import { ErrorCode } from "../enums/error-code.enum";
import { ErrorType } from "../enums/error-type.enum";

export class InternalServerError extends AppError {
    constructor(message = "Internal Server Error", code: ErrorCode = ErrorCode.INTERNAL_ERROR) {
        super(message, 500, code, ErrorType.INTERNAL, true);
    }
}
