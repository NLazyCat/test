import { FunctionOperationDescriptor } from "../types";
import { ValidationError } from "../utils/validator";

// nth root: root(x, n) computes the n-th root of x (ⁿ√x)
export const root = (x: number, n: number): number => {
  if (n === 0) {
    throw new ValidationError("Root degree cannot be zero");
  }
  if (x < 0 && n % 2 === 0) {
    throw new ValidationError("Even root of negative number");
  }
  const sign = x < 0 ? -1 : 1;
  return sign * Math.pow(Math.abs(x), 1 / n);
};

export const rootDescriptor: FunctionOperationDescriptor = {
  name: "root",
  fn: root,
};
