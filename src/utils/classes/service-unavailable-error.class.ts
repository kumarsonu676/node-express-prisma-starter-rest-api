import { AppError } from "./app-error.class";
import { ErrorCode } from "../enums/error-code.enum";
import { ErrorType } from "../enums/error-type.enum";

export class ServiceUnavailableError extends AppError {
    constructor(message = "Service Unavailable", code: ErrorCode = ErrorCode.SERVICE_UNAVAILABLE) {
        super(message, 503, code, ErrorType.INTERNAL, true);
    }
}
