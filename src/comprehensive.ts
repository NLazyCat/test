import {
  CalculationResult, ComplexNumber, Matrix2x2, StatResult,
  EvaluationContext, CalculationStep, BinaryOperation,
} from "./types";
import {
  validateNumber, validateArray, validateComplex, validateMatrix,
  ValidationError,
} from "./utils/validator";
import { tokenize, findOperation, ParsedToken } from "./utils/parser";
import { add, addDescriptor } from "./operations/add";
import { subtract, subtractDescriptor } from "./operations/subtract";
import { multiply, multiplyDescriptor } from "./operations/multiply";
import { divide, divideDescriptor } from "./operations/divide";

const ALL_OPS: Record<string, { fn: BinaryOperation; desc: string }> = {
  "+": { fn: add, desc: "addition" },
  "-": { fn: subtract, desc: "subtraction" },
  "*": { fn: multiply, desc: "multiplication" },
  "/": { fn: divide, desc: "division" },
};

export function evaluateExpression(expr: string): CalculationResult {
  const tokens = tokenize(expr);
  if (tokens.length < 3 || tokens[0].type !== "number") {
    throw new ValidationError("Expression must start with a number");
  }
  let result = tokens[0].value as number;
  let lastOp = "start";
  for (let i = 1; i + 1 < tokens.length; i += 2) {
    if (tokens[i].type !== "operator" || tokens[i + 1].type !== "number") {
      throw new ValidationError("Invalid expression format");
    }
    const op = ALL_OPS[tokens[i].value as string];
    if (op) {
      result = op.fn(result, tokens[i + 1].value as number);
      lastOp = op.desc;
    } else if (tokens[i].value === "^") {
      result = Math.pow(result, tokens[i + 1].value as number);
      lastOp = "power";
    } else {
      throw new ValidationError(`Unknown operator: ${tokens[i].value}`);
    }
  }
  return { expression: expr, value: result, operation: lastOp };
}

export function evaluateWithContext(expr: string, ctx: EvaluationContext): CalculationResult {
  let resolved = expr;
  for (const [name, val] of Object.entries(ctx.variables)) {
    resolved = resolved.replace(new RegExp(`\\b${name}\\b`, "g"), String(val));
  }
  return evaluateExpression(resolved);
}

export function batchEvaluate(expressions: string[]): CalculationResult[] {
  return expressions.map((e) => evaluateExpression(e));
}

export function averageResults(results: CalculationResult[]): number {
  const sum = results.reduce((a, r) => a + r.value, 0);
  return sum / results.length;
}

export function complexAdd(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const r = a.real + b.real;
  const i = a.imag + b.imag;
  return validateComplex({ real: r, imag: i });
}

export function complexSub(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return validateComplex({ real: a.real - b.real, imag: a.imag - b.imag });
}

export function complexMul(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const r = a.real * b.real - a.imag * b.imag;
  const i = a.real * b.imag + a.imag * b.real;
  return validateComplex({ real: r, imag: i });
}

export function complexDiv(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const denom = b.real * b.real + b.imag * b.imag;
  if (denom === 0) throw new ValidationError("Complex division by zero");
  const r = (a.real * b.real + a.imag * b.imag) / denom;
  const i = (a.imag * b.real - a.real * b.imag) / denom;
  return validateComplex({ real: r, imag: i });
}

export function complexConj(z: ComplexNumber): ComplexNumber {
  return validateComplex({ real: z.real, imag: -z.imag });
}

export function complexAbs(z: ComplexNumber): number {
  return Math.sqrt(z.real * z.real + z.imag * z.imag);
}

export function complexPhase(z: ComplexNumber): number {
  if (z.real === 0 && z.imag === 0) throw new ValidationError("Phase undefined for origin");
  return Math.atan2(z.imag, z.real);
}

export function complexPow(z: ComplexNumber, n: number): ComplexNumber {
  if (n === 0) return validateComplex({ real: 1, imag: 0 });
  const r = complexAbs(z);
  const theta = complexPhase(z);
  const rn = Math.pow(r, n);
  return validateComplex({ real: rn * Math.cos(n * theta), imag: rn * Math.sin(n * theta) });
}

export function complexSqrt(z: ComplexNumber): ComplexNumber {
  return complexPow(z, 0.5);
}

export function matrixAdd(a: Matrix2x2, b: Matrix2x2): Matrix2x2 {
  return validateMatrix({ a: a.a + b.a, b: a.b + b.b, c: a.c + b.c, d: a.d + b.d });
}

export function matrixSub(a: Matrix2x2, b: Matrix2x2): Matrix2x2 {
  return validateMatrix({ a: a.a - b.a, b: a.b - b.b, c: a.c - b.c, d: a.d - b.d });
}

export function matrixMul(a: Matrix2x2, b: Matrix2x2): Matrix2x2 {
  return validateMatrix({
    a: a.a * b.a + a.b * b.c, b: a.a * b.b + a.b * b.d,
    c: a.c * b.a + a.d * b.c, d: a.c * b.b + a.d * b.d,
  });
}

export function matrixDet(m: Matrix2x2): number {
  return m.a * m.d - m.b * m.c;
}

export function matrixInv(m: Matrix2x2): Matrix2x2 {
  const det = matrixDet(m);
  if (det === 0) throw new ValidationError("Singular matrix has no inverse");
  return validateMatrix({ a: m.d / det, b: -m.b / det, c: -m.c / det, d: m.a / det });
}

export function matrixScale(m: Matrix2x2, s: number): Matrix2x2 {
  return validateMatrix({ a: m.a * s, b: m.b * s, c: m.c * s, d: m.d * s });
}

export function matrixApply(m: Matrix2x2, x: number, y: number): { x: number; y: number } {
  return { x: m.a * x + m.b * y, y: m.c * x + m.d * y };
}

export function evaluateWithSteps(expr: string): CalculationStep[] {
  const steps: CalculationStep[] = [];
  const tokens = tokenize(expr);
  if (tokens.length < 3 || tokens[0].type !== "number") {
    throw new ValidationError("Cannot evaluate empty expression");
  }
  let result = tokens[0].value as number;
  steps.push({ description: "Initialize", input: String(result), output: result, duration: 0.1 });
  for (let i = 1; i + 1 < tokens.length; i += 2) {
    const sym = String(tokens[i].value);
    const val = tokens[i + 1].value as number;
    const t0 = Date.now();
    const op = ALL_OPS[sym];
    if (!op) throw new ValidationError(`Unknown operator: ${sym}`);
    const prev = result;
    result = op.fn(result, val);
    const t1 = Date.now();
    steps.push({
      description: op.desc,
      input: `${prev} ${sym} ${val}`,
      output: result,
      duration: t1 - t0,
    });
  }
  return steps;
}

export function totalDuration(steps: CalculationStep[]): number {
  return steps.reduce((s, step) => s + step.duration, 0);
}

export function aggregateResults(results: CalculationResult[]): StatResult {
  const values = validateArray(results.map((r) => r.value));
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stddev = Math.sqrt(variance);
  const range = sorted[n - 1] - sorted[0];
  return { mean, median, stddev, variance, min: sorted[0], max: sorted[n - 1], count: n };
}

export function parallelEvaluate(expressions: string[]): CalculationResult[] {
  return expressions.map((e) => {
    const r = evaluateExpression(e);
    const steps = evaluateWithSteps(e);
    const dur = totalDuration(steps);
    return { ...r, operation: `${r.operation} (${dur}ms)` };
  });
}

export function deepAnalyze(expr: string): {
  result: CalculationResult;
  complexity: number;
  tokenCount: number;
  hasComplexOps: boolean;
} {
  const result = evaluateExpression(expr);
  const tokens = tokenize(expr);
  const complexity = tokens.filter((t) => t.type === "operator").length;
  const hasComplexOps = tokens.some((t) => t.value === "*" || t.value === "/");
  return { result, complexity, tokenCount: tokens.length, hasComplexOps };
}

export function createContext(vars: Record<string, number>): EvaluationContext {
  return { variables: vars, functions: {}, maxSteps: 100, steps: [] };
}

export function runFullAnalysis(expressions: string[]): {
  results: CalculationResult[];
  stats: StatResult;
  totalTime: number;
  allSteps: CalculationStep[][];
} {
  const allResults = parallelEvaluate(expressions);
  const allSteps = expressions.map((e) => evaluateWithSteps(e));
  const stats = aggregateResults(allResults);
  const totalTime = allSteps.reduce((s, steps) => s + totalDuration(steps), 0);
  return { results: allResults, stats, totalTime, allSteps };
}

export function calculate(expression: string): CalculationResult {
  const input = String(expression).trim();
  if (input.length === 0) throw new ValidationError("Empty expression");
  return evaluateExpression(input);
}