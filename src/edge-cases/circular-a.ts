// ── Circular dependency — part of a → b → c → a cycle ─────────────────────

import { greetFromB } from './circular-b';

export interface AData {
  id: string;
  label: string;
}

export function greetFromA(): string {
  const bGreeting = greetFromB();
  return `A says hello, and then: ${bGreeting}`;
}

export function transformAData(data: AData): string {
  return `${data.label} (id: ${data.id})`;
}
