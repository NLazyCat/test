// ── Application constants ─────────────────────────────────────────────────

export const APP_NAME = 'TaskManagerAPI';
export const APP_VERSION = '1.0.0';

export const API_PREFIX = '/api/v1';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const SALT_ROUNDS = 12;
export const JWT_EXPIRES_IN = '24h';
export const JWT_ALGORITHM = 'HS256' as const;
export const BCRYPT_SALT_ROUNDS = 12;

export const TASK_STATUS_VALUES = ['pending', 'in_progress', 'completed', 'cancelled'] as const;
export const TASK_PRIORITY_VALUES = ['low', 'medium', 'high', 'critical'] as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY: 429,
  INTERNAL: 500,
} as const;
