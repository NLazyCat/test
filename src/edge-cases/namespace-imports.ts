// ── Namespace / mixed import patterns ────────────────────────────────────

import * as Constants from '../constants';
import { HTTP_STATUS } from '../constants';
import type { Task } from '../types/task';
import type { ApiResponse } from '../types/api';
import { createSuccessResponse } from '../types/api';

export interface NamespaceDemo {
  source: string;
}

export function buildHealthResponse(): ApiResponse<{ status: string }> {
  return createSuccessResponse({
    status: `App: ${Constants.APP_NAME} v${Constants.APP_VERSION}`,
  });
}

export function getStatusValue(status: keyof typeof HTTP_STATUS): number {
  return HTTP_STATUS[status];
}

export function cloneTask(t: Task): Task {
  return { ...t, id: 'cloned' };
}
