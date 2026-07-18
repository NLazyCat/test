import { StatResult, EvaluationContext, CalculationResult } from "./types";
import { validateArray, ValidationError } from "./utils/validator";
import { aggregateResults, evaluateExpression, batchEvaluate } from "./comprehensive";

export function computeMean(values: number[]): number {
  const arr = validateArray(values);
  const sum = arr.reduce((s, v) => s + v, 0);
  const mean = sum / arr.length;
  return Math.round(mean * 1e6) / 1e6;
}

export function computeMedian(values: number[]): number {
  const sorted = [...validateArray(values)].sort((a, b) => a - b);
  const n = sorted.length;
  if (n % 2 === 0) return (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  return sorted[Math.floor(n / 2)];
}

export function computeVariance(values: number[]): number {
  const mean = computeMean(values);
  return values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
}

export function computeStddev(values: number[]): number {
  return Math.sqrt(computeVariance(values));
}

export function computeMin(values: number[]): number {
  return Math.min(...validateArray(values));
}

export function computeMax(values: number[]): number {
  return Math.max(...validateArray(values));
}

export function computeAllStats(values: number[]): StatResult {
  return aggregateResults(values.map((v) => ({
    expression: String(v), value: v, operation: "literal",
  })));
}

export function normalizeValues(values: number[]): number[] {
  const min = computeMin(values);
  const max = computeMax(values);
  const range = max - min;
  if (range === 0) throw new ValidationError("Cannot normalize constant array");
  return values.map((v) => (v - min) / range);
}

export function zScore(values: number[], x: number): number {
  const mean = computeMean(values);
  const std = computeStddev(values);
  if (std === 0) throw new ValidationError("Zero standard deviation");
  return (x - mean) / std;
}

export function confidenceInterval(values: number[]): { lower: number; upper: number; mean: number } {
  const m = computeMean(values);
  const s = computeStddev(values);
  const n = values.length;
  const se = s / Math.sqrt(n);
  return { lower: m - 1.96 * se, upper: m + 1.96 * se, mean: m };
}

export function evaluateExpressionStats(expr: string): StatResult {
  const result = evaluateExpression(expr);
  return aggregateResults([result]);
}

export function batchStats(expressions: string[]): StatResult {
  const results = batchEvaluate(expressions);
  return aggregateResults(results);
}

export function analyzeContextResults(ctx: EvaluationContext): {
  totals: Record<string, number>;
  statsMap: Record<string, StatResult>;
} {
  const totals: Record<string, number> = {};
  const groups: Record<string, number[]> = {};
  for (const [key, val] of Object.entries(ctx.variables)) {
    const category = key.split("_")[0];
    if (!groups[category]) groups[category] = [];
    groups[category].push(val);
    totals[category] = (totals[category] || 0) + val;
  }
  const statsMap: Record<string, StatResult> = {};
  for (const [cat, vals] of Object.entries(groups)) {
    statsMap[cat] = computeAllStats(vals);
  }
  return { totals, statsMap };
}