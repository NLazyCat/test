// ── Global error handler middleware ───────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, APP_NAME, APP_VERSION } from '../constants';
import type { ApiResponse } from '../types/api';
import { createErrorResponse } from '../types/api';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundHandler(req: Request, res: Response<ApiResponse<never>>): void {
  res.status(HTTP_STATUS.NOT_FOUND).json(
    createErrorResponse({ code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` }),
  );
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse<never>>,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      createErrorResponse({ code: err.code, message: err.message, details: err.details }),
    );
    return;
  }

  console.error(`[${APP_NAME} v${APP_VERSION}] Unhandled error:`, err);
  res.status(HTTP_STATUS.INTERNAL).json(
    createErrorResponse({ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }),
  );
}
