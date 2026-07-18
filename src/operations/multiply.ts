import { BinaryOperation, OperationDescriptor } from "../types";

export const multiply: BinaryOperation = (a, b) => a * b;

export const multiplyDescriptor: OperationDescriptor = {
  name: "multiply",
  symbol: "*",
  fn: multiply,
  precedence: 2,
};
