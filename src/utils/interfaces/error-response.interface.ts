import { ErrorCode } from '../enums/error-code.enum';
import { ErrorType } from '../enums/error-type.enum';

export interface ErrorResponse {
  status: 'error';
  statusCode: number;
  code: ErrorCode;
  type: ErrorType;
  message: string;
  timestamp: string;
  requestId?: string;
  errors?: Record<string, unknown>[];
  stack?: string;
}
