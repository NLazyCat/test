// ── Authentication routes ─────────────────────────────────────────────────

import { Router, type Request, type Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { createSuccessResponse, createErrorResponse } from '../types/api';
import { login } from '../services/auth-service';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(
      createErrorResponse({ code: 'VALIDATION_ERROR', message: 'Email and password are required' }),
    );
    return;
  }

  const result = await login(email, password);
  if (!result) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json(
      createErrorResponse({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }),
    );
    return;
  }

  res.status(HTTP_STATUS.OK).json(
    createSuccessResponse({
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    }),
  );
});

export default router;
