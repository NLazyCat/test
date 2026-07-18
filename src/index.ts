import { CalculationResult } from "./types";
import { tokenize, findOperation, findFunction, ParsedToken } from "./utils/parser";
import { validateNumber, validateResult, ValidationError } from "./utils/validator";

// Evaluate a single function argument: direct number (incl. negatives) or a
// sub-expression that is recursively calculated (e.g. "2 + 2" or "sqrt(16)").
function evaluateArg(arg: string): number {
  const trimmed = arg.trim();
  if (trimmed === "") {
    throw new ValidationError("Empty function argument");
  }
  if (/^-?\d*\.?\d+$/.test(trimmed)) {
    return validateNumber(trimmed);
  }
  return calculate(trimmed).value;
}

// Evaluate a parsed token into a numeric value.
function evaluateToken(token: ParsedToken): number {
  if (token.type === "number") {
    return validateNumber(String(token.value));
  }
  if (token.type === "function") {
    const fn = findFunction(String(token.value));
    const argValues = (token.args || []).map(evaluateArg);
    return fn.fn(...argValues);
  }
  throw new ValidationError("Malformed expression");
}

export function calculate(expression: string): CalculationResult {
  const tokens = tokenize(expression);

  // Simple left-to-right evaluation (no parentheses for binary ops)
  let result = evaluateToken(tokens[0]);
  let lastOp =
    tokens[0].type === "function" ? String(tokens[0].value) : "start";

  for (let i = 1; i < tokens.length; i += 2) {
    const opToken = tokens[i];
    const operandToken = tokens[i + 1];

    if (
      !operandToken ||
      opToken.type !== "operator" ||
      (operandToken.type !== "number" && operandToken.type !== "function")
    ) {
      throw new ValidationError("Malformed expression");
    }

    const op = findOperation(String(opToken.value));
    const num = evaluateToken(operandToken);
    result = op.fn(result, num);
    lastOp = op.name;
  }

  const calcResult: CalculationResult = {
    expression,
    value: result,
    operation: lastOp,
  };

  if (!validateResult(calcResult)) {
    throw new ValidationError("Calculation resulted in invalid value");
  }

  return calcResult;
}

export function run(): void {
  const args = process.argv.slice(2);
  const input = args.join(" ") || "1 + 2";

  try {
    const result = calculate(input);
    console.log(`${result.expression} = ${result.value}`);
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error(`Error: ${err.message}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
    process.exit(1);
  }
}

run();
