import { NotFoundError } from './not-found-error.class';
import { ErrorCode } from '../enums/error-code.enum';

export class PrismaRecordNotFoundError extends NotFoundError {
  constructor(message = 'Record not found') {
    super(message, ErrorCode.DB_RECORD_NOT_FOUND);
  }
}
