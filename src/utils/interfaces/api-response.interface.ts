export interface ApiResponse<T = unknown> {
  status: 'success';
  statusCode: number;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T = unknown> extends Omit<ApiResponse<T>, 'data'> {
  data: T[];
  meta: PaginatedMeta;
}
