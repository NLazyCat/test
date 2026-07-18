import { BinaryOperation, OperationDescriptor } from "../types";

export const subtract: BinaryOperation = (a, b) => a - b;

export const subtractDescriptor: OperationDescriptor = {
  name: "subtract",
  symbol: "-",
  fn: subtract,
  precedence: 1,
};
