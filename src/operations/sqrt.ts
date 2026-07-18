import { FunctionOperationDescriptor } from "../types";
import { ValidationError } from "../utils/validator";

export const sqrt = (x: number): number => {
  if (x < 0) {
    throw new ValidationError("Square root of negative number");
  }
  return Math.sqrt(x);
};

export const sqrtDescriptor: FunctionOperationDescriptor = {
  name: "sqrt",
  fn: sqrt,
};
