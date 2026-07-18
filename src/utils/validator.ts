import { CalculationResult } from "../types";

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
