import { AppError } from './app-error.class';
import { ErrorCode } from '../enums/error-code.enum';
import { ErrorType } from '../enums/error-type.enum';

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', code: ErrorCode = ErrorCode.RESOURCE_NOT_FOUND) {
    super(message, 404, code, ErrorType.NOT_FOUND);
  }
}
