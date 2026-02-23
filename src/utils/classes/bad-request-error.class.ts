import { AppError } from "./app-error.class";
import { ErrorCode } from "../enums/error-code.enum";
import { ErrorType } from "../enums/error-type.enum";

export class BadRequestError extends AppError {
    constructor(message = "Bad Request", code: ErrorCode = ErrorCode.INVALID_INPUT) {
        super(message, 400, code, ErrorType.BAD_REQUEST);
    }
}
