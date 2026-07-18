import { FunctionOperationDescriptor } from "../types";
import { ValidationError } from "../utils/validator";

// log(x, base) computes log_base(x). If base is omitted, natural log is used.
export const log = (x: number, base?: number): number => {
  if (x <= 0) {
    throw new ValidationError("Logarithm of non-positive number");
  }
  if (base !== undefined) {
    if (base <= 0 || base === 1) {
      throw new ValidationError("Invalid logarithm base");
    }
    return Math.log(x) / Math.log(base);
  }
  return Math.log(x);
};

export const logDescriptor: FunctionOperationDescriptor = {
  name: "log",
  fn: log,
};
