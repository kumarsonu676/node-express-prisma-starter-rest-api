import { AppError } from "./app-error.class";
import { ErrorCode } from "../enums/error-code.enum";
import { ErrorType } from "../enums/error-type.enum";

export class ConflictError extends AppError {
    constructor(message = "Conflict", code: ErrorCode = ErrorCode.RECORD_CONFLICT) {
        super(message, 409, code, ErrorType.CONFLICT);
    }
}
