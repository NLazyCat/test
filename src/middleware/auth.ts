// ── Authentication middleware ─────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth-service';
import { HTTP_STATUS } from '../constants';
import type { ApiResponse } from '../types/api';
import type { UserRole } from '../types/user';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: UserRole;
  userEmail?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response<ApiResponse<never>>, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' },
    });
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: { code: 'TOKEN_INVALID', message: 'Token is invalid or expired' },
    });
    return;
  }

  req.userId = payload.userId;
  req.userEmail = payload.email;
  req.userRole = payload.role as UserRole;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response<ApiResponse<never>>, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: { code: 'FORBIDDEN', message: `Requires one of roles: ${roles.join(', ')}` },
      });
      return;
    }
    next();
  };
}
