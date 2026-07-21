// ── Direct circular dependency (2-way cycle) ──────────────────────────────

import { createCycleResult } from './direct-cycle-a';
import type { DirectCycleResult } from './direct-cycle-a';

export function directBHelper(): string {
  return 'B payload';
}

export function verifyCycle(): DirectCycleResult {
  return createCycleResult();
}
