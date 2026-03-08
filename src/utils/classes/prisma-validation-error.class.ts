import { ValidationError } from './validation-error.class';
import { ErrorCode } from '../enums/error-code.enum';

export class PrismaValidationError extends ValidationError {
  constructor(message: string, errors: Record<string, unknown>[]) {
    super(message, errors, ErrorCode.DB_VALIDATION_FAILED);
  }
}
