import { addDescriptor } from "../operations/add.js";
import { subtractDescriptor } from "../operations/subtract.js";
import { multiplyDescriptor } from "../operations/multiply.js";
import { divideDescriptor } from "../operations/divide.js";
import { OperationDescriptor } from "../types.js";
import { ValidationError } from "./validator.js";

const operations: OperationDescriptor[] = [
  addDescriptor,
  subtractDescriptor,
  multiplyDescriptor,
  divideDescriptor,
];

export interface ParsedToken {
  type: "number" | "operator";
  value: number | string;
}

export function tokenize(input: string): ParsedToken[] {
  const trimmed = input.replace(/\s+/g, "");
  const tokens: ParsedToken[] = [];
  let current = "";

  for (const ch of trimmed) {
    if ("+-*/".includes(ch)) {
      if (current) {
        tokens.push({ type: "number", value: Number(current) });
        current = "";
      }
      tokens.push({ type: "operator", value: ch });
    } else {
      current += ch;
    }
  }

  if (current) {
    tokens.push({ type: "number", value: Number(current) });
  }

  if (tokens.length === 0) {
    throw new ValidationError("Empty expression");
  }

  return tokens;
}

export function findOperation(symbol: string): OperationDescriptor {
  const op = operations.find((o) => o.symbol === symbol);
  if (!op) {
    throw new ValidationError(`Unknown operator: ${symbol}`);
  }
  return op;
}
