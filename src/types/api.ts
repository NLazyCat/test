// ── API contract types ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
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
  totalPages: number;
}

export function createSuccessResponse<T>(data: T, meta?: PaginationMeta): ApiResponse<T> {
  return { success: true, data, meta };
}

export function createErrorResponse(code: string, message: string, details?: Record<string, string[]>): ApiResponse<never> {
  return { success: false, error: { code, message, details } };
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  version: string;
  timestamp: string;
}
