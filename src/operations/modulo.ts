import { BinaryOperation, OperationDescriptor } from "../types";

export const modulo: BinaryOperation = (a, b) => a % b;

export const moduloDescriptor: OperationDescriptor = {
  name: "modulo",
  symbol: "%",
  fn: modulo,
  precedence: 2,
};
