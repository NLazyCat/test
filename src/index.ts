import { CalculationResult } from "./types";
import { tokenize, findOperation } from "./utils/parser";
import { validateNumber, validateResult, ValidationError } from "./utils/validator";

export function calculate(expression: string): CalculationResult {
  const tokens = tokenize(expression);

  // Simple left-to-right evaluation (no parentheses for simplicity)
  let result = validateNumber(String(tokens[0].value));
  let lastOp = "start";

  for (let i = 1; i < tokens.length; i += 2) {
    const opToken = tokens[i];
    const numToken = tokens[i + 1];

    if (!numToken || opToken.type !== "operator" || numToken.type !== "number") {
      throw new ValidationError("Malformed expression");
    }

    const op = findOperation(String(opToken.value));
    const num = validateNumber(String(numToken.value));
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
