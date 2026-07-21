// ── General utility functions ─────────────────────────────────────────────

import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function extractPaginationParams(query: Record<string, unknown>): { page: number; limit: number; offset: number } {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function sanitizeTags(tags: string[]): string[] {
  return [...new Set(tags.map(t => t.trim().toLowerCase()).filter(Boolean))];
}
