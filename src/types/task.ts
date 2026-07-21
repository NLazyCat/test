// ── Task domain types ─────────────────────────────────────────────────────

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  createdBy: string;
  tags: string[];
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  tags?: string[];
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  tags?: string[];
  dueDate?: string | null;
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface TaskSummary {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}
