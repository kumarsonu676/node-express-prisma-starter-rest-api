import { ConflictError } from './conflict-error.class';
import { ErrorCode } from '../enums/error-code.enum';

export class PrismaForeignKeyError extends ConflictError {
  constructor(message = 'Referenced record does not exist') {
    super(message, ErrorCode.DB_FOREIGN_KEY_CONSTRAINT);
  }
}
