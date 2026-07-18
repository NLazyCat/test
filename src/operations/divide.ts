import { BinaryOperation, OperationDescriptor } from "../types";
import { ValidationError } from "../utils/validator";

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
