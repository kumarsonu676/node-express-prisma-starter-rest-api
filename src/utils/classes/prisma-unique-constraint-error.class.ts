import { ConflictError } from './conflict-error.class';
import { ErrorCode } from '../enums/error-code.enum';

export class PrismaUniqueConstraintError extends ConflictError {
  constructor(message = 'Record already exists') {
    super(message, ErrorCode.DB_UNIQUE_CONSTRAINT);
  }
}
