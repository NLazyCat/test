// ── Application entry point ───────────────────────────────────────────────

import express from 'express';
import { API_PREFIX, HTTP_STATUS, APP_NAME, APP_VERSION } from './constants';
import { createSuccessResponse } from './types/api';
import { notFoundHandler, errorHandler } from './middleware/error-handler';
import healthRoutes from './routes/health-routes';
import authRoutes from './routes/auth-routes';
import userRoutes from './routes/user-routes';
import taskRoutes from './routes/task-routes';

const app = express();

// ── Global middleware ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────────
app.use(API_PREFIX, healthRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/tasks`, taskRoutes);

// ── Error handling ──────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start server ────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '3000', 10);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[${APP_NAME} v${APP_VERSION}] Server listening on port ${PORT}`);
  });
}

export { app };
export default app;
