// ── Direct circular dependency (2-way cycle) ──────────────────────────────

import { directBHelper } from './direct-cycle-b';

export interface DirectCycleResult {
  fromA: string;
  fromB: string;
}

export function directAHelper(): string {
  return `A helped: ${directBHelper()}`;
}

export function createCycleResult(): DirectCycleResult {
  return {
    fromA: 'A side',
    fromB: directBHelper(),
  };
}
