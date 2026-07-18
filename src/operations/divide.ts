import { BinaryOperation, OperationDescriptor } from "../types.js";
import { ValidationError } from "../utils/validator.js";

export const divide: BinaryOperation = (a, b) => {
  if (b === 0) {
    throw new ValidationError("Division by zero");
  }
  return a / b;
};

export const divideDescriptor: OperationDescriptor = {
  name: "divide",
  symbol: "/",
  fn: divide,
  precedence: 2,
};
