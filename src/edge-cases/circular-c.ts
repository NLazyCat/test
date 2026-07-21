// ── Circular dependency — part of a → b → c → a cycle ─────────────────────

import { transformAData } from './circular-a';

export interface CData {
  timestamp: number;
  payload: unknown;
}

export function greetFromC(): string {
  return 'C says hello!';
}

export function wrapCData(data: CData): string {
  const aData = { id: 'c-generated', label: 'Wrapped from C' };
  return transformAData(aData);
}
