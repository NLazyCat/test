// ── API contract types ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  statusCode?: number;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pageCount: number;       // renamed from totalPages
}

export function createPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    pageCount: Math.ceil(total / limit),
  };
}

export function createSuccessResponse<T>(data: T, meta?: PaginationMeta, statusCode = 200): ApiResponse<T> {
  return { success: true, data, meta, statusCode };
}

export function createErrorResponse(error: ApiError): ApiResponse<never> {
  return { success: false, error };
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  version: string;
  timestamp: string;
}
