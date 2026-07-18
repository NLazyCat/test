export interface CalculationResult {
  expression: string;
  value: number;
  operation: string;
}

export type BinaryOperation = (a: number, b: number) => number;

export interface OperationDescriptor {
  name: string;
  symbol: string;
  fn: BinaryOperation;
  precedence: number;
}

export interface ComplexNumber {
  real: number;
  imag: number;
}

export interface Matrix2x2 {
  a: number; b: number;
  c: number; d: number;
}

export interface StatResult {
  mean: number;
  median: number;
  stddev: number;
  variance: number;
  min: number;
  max: number;
  count: number;
}

export interface EvaluationContext {
  variables: Record<string, number>;
  functions: Record<string, (...args: number[]) => number>;
  maxSteps: number;
  steps: CalculationStep[];
}

export interface CalculationStep {
  description: string;
  input: string;
  output: number;
  duration: number;
}
