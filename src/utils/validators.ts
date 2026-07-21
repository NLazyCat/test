// ── Validation helpers ────────────────────────────────────────────────────

import { TASK_STATUS_VALUES, TASK_PRIORITY_VALUES, MAX_PAGE_SIZE } from '../constants';
import type { UserRole } from '../types/user';
import type { CreateTaskRequest, TaskFilter, UpdateTaskRequest } from '../types/task';
import type { CreateUserRequest, UpdateUserRequest } from '../types/user';

type ValidationResult = { valid: true } | { valid: false; errors: Record<string, string[]> };

function addError(errors: Record<string, string[]>, field: string, message: string): void {
  if (!errors[field]) errors[field] = [];
  errors[field].push(message);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRequiredString(value: unknown, field: string, errors: Record<string, string[]>): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    addError(errors, field, `${field} is required and must be a non-empty string`);
  }
}

export function validatePassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}

export function validateCreateUserRequest(req: CreateUserRequest): ValidationResult {
  const errors: Record<string, string[]> = {};
  validateRequiredString(req.email, 'email', errors);
  if (req.email && !validateEmail(req.email)) {
    addError(errors, 'email', 'Invalid email format');
  }
  validateRequiredString(req.name, 'name', errors);
  validateRequiredString(req.password, 'password', errors);
  if (req.password && !validatePassword(req.password)) {
    addError(errors, 'password', 'Password must be 8+ chars with upper, lower, and digit');
  }
  return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateUpdateUserRequest(req: UpdateUserRequest): ValidationResult {
  const errors: Record<string, string[]> = {};
  if (req.email !== undefined && !validateEmail(req.email)) {
    addError(errors, 'email', 'Invalid email format');
  }
  return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateCreateTaskRequest(req: CreateTaskRequest): ValidationResult {
  const errors: Record<string, string[]> = {};
  validateRequiredString(req.title, 'title', errors);
  if (req.priority && !TASK_PRIORITY_VALUES.includes(req.priority as any)) {
    addError(errors, 'priority', `Priority must be one of: ${TASK_PRIORITY_VALUES.join(', ')}`);
  }
  return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateUpdateTaskRequest(req: UpdateTaskRequest): ValidationResult {
  const errors: Record<string, string[]> = {};
  if (req.status && !TASK_STATUS_VALUES.includes(req.status as any)) {
    addError(errors, 'status', `Status must be one of: ${TASK_STATUS_VALUES.join(', ')}`);
  }
  if (req.priority && !TASK_PRIORITY_VALUES.includes(req.priority as any)) {
    addError(errors, 'priority', `Priority must be one of: ${TASK_PRIORITY_VALUES.join(', ')}`);
  }
  return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
}

export function validateTaskFilter(filter: TaskFilter): ValidationResult {
  const errors: Record<string, string[]> = {};
  if (filter.page !== undefined && (filter.page < 1 || !Number.isInteger(filter.page))) {
    addError(errors, 'page', 'Page must be a positive integer');
  }
  if (filter.limit !== undefined) {
    if (filter.limit < 1 || !Number.isInteger(filter.limit)) {
      addError(errors, 'limit', 'Limit must be a positive integer');
    } else if (filter.limit > MAX_PAGE_SIZE) {
      addError(errors, 'limit', `Limit cannot exceed ${MAX_PAGE_SIZE}`);
    }
  }
  return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
}
