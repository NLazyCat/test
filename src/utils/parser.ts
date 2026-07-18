import { addDescriptor } from "../operations/add";
import { subtractDescriptor } from "../operations/subtract";
import { multiplyDescriptor } from "../operations/multiply";
import { divideDescriptor } from "../operations/divide";
import { sqrtDescriptor } from "../operations/sqrt";
import { rootDescriptor } from "../operations/root";
import { logDescriptor } from "../operations/log";
import { OperationDescriptor, FunctionOperationDescriptor } from "../types";
import { ValidationError } from "./validator";

const operations: OperationDescriptor[] = [
  addDescriptor,
  subtractDescriptor,
  multiplyDescriptor,
  divideDescriptor,
];

const functions: FunctionOperationDescriptor[] = [
  sqrtDescriptor,
  rootDescriptor,
  logDescriptor,
];

export interface ParsedToken {
  type: "number" | "operator" | "function";
  value: number | string;
  args?: string[];
}

export function tokenize(input: string): ParsedToken[] {
  const trimmed = input.replace(/\s+/g, "");
  const tokens: ParsedToken[] = [];
  let current = "";
  let i = 0;

  const flushNumber = () => {
    if (current) {
      tokens.push({ type: "number", value: Number(current) });
      current = "";
    }
  };

  while (i < trimmed.length) {
    const ch = trimmed[i];

    // Binary operator
    if ("+-*/".includes(ch)) {
      flushNumber();
      tokens.push({ type: "operator", value: ch });
      i++;
      continue;
    }

    // Letter: start of a function name (e.g. sqrt, root, log)
    if (/[a-zA-Z]/.test(ch)) {
      flushNumber();
      let name = "";
      while (i < trimmed.length && /[a-zA-Z]/.test(trimmed[i])) {
        name += trimmed[i];
        i++;
      }
      if (trimmed[i] !== "(") {
        throw new ValidationError(`Expected '(' after function name: ${name}`);
      }
      i++; // consume '('

      // Collect comma-separated arguments, respecting nested parentheses
      const args: string[] = [];
      let arg = "";
      let depth = 1;
      while (i < trimmed.length && depth > 0) {
        const c = trimmed[i];
        if (c === "(") {
          depth++;
          arg += c;
        } else if (c === ")") {
          depth--;
          if (depth === 0) {
            if (arg !== "") args.push(arg);
            break;
          }
          arg += c;
        } else if (c === "," && depth === 1) {
          args.push(arg);
          arg = "";
        } else {
          arg += c;
        }
        i++;
      }
      if (depth !== 0) {
        throw new ValidationError(`Unclosed parenthesis in function: ${name}`);
      }
      i++; // consume ')'
      tokens.push({ type: "function", value: name, args });
      continue;
    }

    // Digit or decimal point
    current += ch;
    i++;
  }

  flushNumber();

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

export function findFunction(name: string): FunctionOperationDescriptor {
  const fn = functions.find((f) => f.name === name);
  if (!fn) {
    throw new ValidationError(`Unknown function: ${name}`);
  }
  return fn;
}
