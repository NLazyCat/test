import { BinaryOperation, OperationDescriptor } from "../types";

export const add: BinaryOperation = (a, b) => a + b;

export const addDescriptor: OperationDescriptor = {
  name: "add",
  symbol: "+",
  fn: add,
  precedence: 1,
};
