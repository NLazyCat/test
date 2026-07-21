// ── Task API routes ───────────────────────────────────────────────────────

import { Router, type Request, type Response } from 'express';
import { HTTP_STATUS } from '../constants';
import { createSuccessResponse, createErrorResponse } from '../types/api';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth';
import { createTask, deleteTask, getTaskById, queryTasks, updateTask, getTaskSummary } from '../services/task-store';
import { parseDate, extractPaginationParams } from '../utils/helpers';
import { validateCreateTaskRequest, validateUpdateTaskRequest, validateTaskFilter } from '../utils/validators';
import type { CreateTaskRequest, UpdateTaskRequest, TaskFilter } from '../types/task';

const router = Router();
router.use(requireAuth);

// GET /tasks — list tasks with filtering
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  const filter: TaskFilter = {
    ...extractPaginationParams(req.query as Record<string, unknown>),
    status: req.query.status as any,
    priority: req.query.priority as any,
    assigneeId: req.query.assigneeId as string,
    tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
  };

  const validation = validateTaskFilter(filter);
  if (!validation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(createErrorResponse('VALIDATION_ERROR', 'Invalid filter parameters', validation.errors));
    return;
  }

  const result = queryTasks(filter);
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(result.tasks, {
    page: filter.page ?? 1,
    limit: filter.limit ?? 20,
    total: result.total,
    totalPages: Math.ceil(result.total / (filter.limit ?? 20)),
  }));
});

// GET /tasks/summary — task statistics
router.get('/summary', (_req: AuthenticatedRequest, res: Response) => {
  const summary = getTaskSummary();
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(summary));
});

// GET /tasks/:id — get single task
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  const task = getTaskById(req.params.id);
  if (!task) {
    res.status(HTTP_STATUS.NOT_FOUND).json(createErrorResponse('NOT_FOUND', `Task ${req.params.id} not found`));
    return;
  }
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(task));
});

// POST /tasks — create task
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  const body: CreateTaskRequest = req.body;
  const validation = validateCreateTaskRequest(body);
  if (!validation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(createErrorResponse('VALIDATION_ERROR', 'Invalid task data', validation.errors));
    return;
  }

  const task = createTask(body.title, req.userId!, {
    description: body.description,
    priority: body.priority,
    assigneeId: body.assigneeId,
    tags: body.tags,
    dueDate: parseDate(body.dueDate),
  });
  res.status(HTTP_STATUS.CREATED).json(createSuccessResponse(task));
});

// PUT /tasks/:id — update task
router.put('/:id', (req: AuthenticatedRequest, res: Response) => {
  const body: UpdateTaskRequest = req.body;
  const validation = validateUpdateTaskRequest(body);
  if (!validation.valid) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(createErrorResponse('VALIDATION_ERROR', 'Invalid update data', validation.errors));
    return;
  }

  const task = updateTask(req.params.id, {
    title: body.title,
    description: body.description,
    status: body.status,
    priority: body.priority,
    assigneeId: body.assigneeId,
    tags: body.tags,
    dueDate: parseDate(body.dueDate),
  });

  if (!task) {
    res.status(HTTP_STATUS.NOT_FOUND).json(createErrorResponse('NOT_FOUND', `Task ${req.params.id} not found`));
    return;
  }
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(task));
});

// DELETE /tasks/:id — delete task
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  const deleted = deleteTask(req.params.id);
  if (!deleted) {
    res.status(HTTP_STATUS.NOT_FOUND).json(createErrorResponse('NOT_FOUND', `Task ${req.params.id} not found`));
    return;
  }
  res.status(HTTP_STATUS.NO_CONTENT).send();
});

export default router;
