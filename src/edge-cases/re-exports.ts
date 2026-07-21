// ── Re-export / barrel patterns ──────────────────────────────────────────

// Re-export individual items with rename
export { type AData, transformAData as transformA } from './circular-a';

// Re-export everything from another module
export * from './circular-b';

// Re-export a namespace as an object
import * as CycleModule from './direct-cycle-a';
export { CycleModule as CycleLib };
