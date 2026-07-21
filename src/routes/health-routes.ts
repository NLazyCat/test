// ── Health check routes ───────────────────────────────────────────────────

import { Router, type Request, type Response } from 'express';
import { APP_NAME, APP_VERSION, HTTP_STATUS } from '../constants';
import type { HealthCheckResponse } from '../types/api';
import { createSuccessResponse } from '../types/api';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  const data: HealthCheckResponse = {
    status: 'ok',
    uptime: process.uptime(),
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  };
  res.status(HTTP_STATUS.OK).json(createSuccessResponse(data));
});

router.get('/health/ready', (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json(createSuccessResponse({ ready: true }));
});

export default router;
