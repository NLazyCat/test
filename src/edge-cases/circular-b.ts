// ── Circular dependency — part of a → b → c → a cycle ─────────────────────

import { greetFromC } from './circular-c';

export interface BData {
  code: number;
  description: string;
}

export function greetFromB(): string {
  const cGreeting = greetFromC();
  return `B says hello, and then: ${cGreeting}`;
}

export function processBData(data: BData): string {
  return `[${data.code}] ${data.description}`;
}
