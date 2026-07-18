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
