import { CalculationResult, ComplexNumber, Matrix2x2 } from "../types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateNumber(input: string): number {
  const num = Number(input);
  if (isNaN(num)) {
    throw new ValidationError(`Invalid number: ${input}`);
  }
  if (!isFinite(num)) {
    throw new ValidationError(`Number out of range: ${input}`);
  }
  return num;
}

export function validateResult(result: CalculationResult): boolean {
  if (!isFinite(result.value)) {
    return false;
  }
  return true;
}

export function validateArray(input: number[]): number[] {
  if (input.length === 0) {
    throw new ValidationError("Array cannot be empty");
  }
  return input.map((v) => {
    if (typeof v !== "number" || !isFinite(v)) {
      throw new ValidationError(`Invalid array element: ${v}`);
    }
    return v;
  });
}

export function validateComplex(z: ComplexNumber): ComplexNumber {
  if (!isFinite(z.real) || !isFinite(z.imag)) {
    throw new ValidationError(`Invalid complex number: ${z.real} + ${z.imag}i`);
  }
  return z;
}

export function validateMatrix(m: Matrix2x2): Matrix2x2 {
  for (const key of ["a", "b", "c", "d"] as const) {
    if (!isFinite(m[key])) {
      throw new ValidationError(`Invalid matrix element ${key}: ${m[key]}`);
    }
  }
  return m;
}
