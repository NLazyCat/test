// ── In-memory task store ──────────────────────────────────────────────────

import type { Task, TaskFilter, TaskStatus, TaskPriority } from '../types/task';
import { generateId, sanitizeTags } from '../utils/helpers';

const tasks: Map<string, Task> = new Map();

export function createTask(
  title: string,
  createdBy: string,
  options?: {
    description?: string;
    priority?: TaskPriority;
    assigneeId?: string;
    tags?: string[];
    dueDate?: Date | null;
  },
): Task {
  const now = new Date();
  const task: Task = {
    id: generateId(),
    title,
    description: options?.description ?? '',
    status: 'pending',
    priority: options?.priority ?? 'medium',
    assigneeId: options?.assigneeId ?? null,
    createdBy,
    tags: sanitizeTags(options?.tags ?? []),
    dueDate: options?.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

export function getTaskById(id: string): Task | undefined {
  return tasks.get(id);
}

export function updateTask(id: string, updates: Partial<Task>): Task | undefined {
  const existing = tasks.get(id);
  if (!existing) return undefined;
  const updated: Task = { ...existing, ...updates, id, updatedAt: new Date() };
  tasks.set(id, updated);
  return updated;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}

export function queryTasks(filter: TaskFilter): { tasks: Task[]; total: number } {
  let result = Array.from(tasks.values());

  if (filter.status) result = result.filter(t => t.status === filter.status);
  if (filter.priority) result = result.filter(t => t.priority === filter.priority);
  if (filter.assigneeId) result = result.filter(t => t.assigneeId === filter.assigneeId);
  if (filter.tags && filter.tags.length > 0) {
    result = result.filter(t => filter.tags!.some(tag => t.tags.includes(tag)));
  }

  const total = result.length;
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 20;
  const offset = (page - 1) * limit;
  result = result.slice(offset, offset + limit);

  return { tasks: result, total };
}

export function getTaskSummary(): {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
} {
  const all = Array.from(tasks.values());
  return {
    total: all.length,
    pending: all.filter(t => t.status === 'pending').length,
    inProgress: all.filter(t => t.status === 'in_progress').length,
    completed: all.filter(t => t.status === 'completed').length,
    cancelled: all.filter(t => t.status === 'cancelled').length,
  };
}

export function getTasksByAssignee(assigneeId: string): Task[] {
  return Array.from(tasks.values()).filter(t => t.assigneeId === assigneeId);
}

/** For testing — clears all tasks */
export function _resetTasks(): void {
  tasks.clear();
}
