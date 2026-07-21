// ── User API routes ───────────────────────────────────────────────────────

import { Router, type Request, type Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { createSuccessResponse, createErrorResponse } from '../types/api';
import { requireAuth, requireRole, type AuthenticatedRequest } from '../middleware/auth';
import { createUser, getUserById, updateUser, deleteUser, listUsers } from '../services/user-store';
import { UserRole } from '../types/user';
import { toUserResponse } from '../types/user';
import { validateCreateUserRequest, validateUpdateUserRequest } from '../utils/validators';
import type { CreateUserRequest, UpdateUserRequest } from '../types/user';

const router = Router();

// POST /users — create user (public, for registration)
router.post('/', async (req: Request, res: Response) => {
  const body: CreateUserRequest = req.body;
  const validation = validateCreateUserRequest(body);
  if (!validation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(createErrorResponse({ code: 'VALIDATION_ERROR', message: 'Invalid user data', details: validation.errors }));
    return;
  }

  const user = await createUser(body.email, body.name, body.password, body.role ?? UserRole.Member);
  res.status(HTTP_STATUS.CREATED).json(createSuccessResponse(toUserResponse(user)));
});

// GET /users — list users (admin only)
router.get('/', requireAuth, requireRole(UserRole.Admin), (_req: AuthenticatedRequest, res: Response) => {
  const users = listUsers().map(toUserResponse);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(users));
});

// GET /users/:id — get user by ID
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = getUserById(req.params.id);
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json(createErrorResponse({ code: 'NOT_FOUND', message: `User ${req.params.id} not found` }));
    return;
  }
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(toUserResponse(user)));
});

// PUT /users/:id — update user
router.put('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const body: UpdateUserRequest = req.body;
  const validation = validateUpdateUserRequest(body);
  if (!validation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(createErrorResponse({ code: 'VALIDATION_ERROR', message: 'Invalid update data', details: validation.errors }));
    return;
  }

  const user = updateUser(req.params.id, {
    name: body.name,
    email: body.email,
    role: body.role,
  });
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json(createErrorResponse({ code: 'NOT_FOUND', message: `User ${req.params.id} not found` }));
    return;
  }
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(toUserResponse(user)));
});

// DELETE /users/:id — delete user
router.delete('/:id', requireAuth, requireRole(UserRole.Admin), (req: AuthenticatedRequest, res: Response) => {
  const deleted = deleteUser(req.params.id);
  if (!deleted) {
    res.status(HTTP_STATUS.NOT_FOUND).json(createErrorResponse({ code: 'NOT_FOUND', message: `User ${req.params.id} not found` }));
    return;
  }
  res.status(HTTP_STATUS.NO_CONTENT).send();
});

export default router;
