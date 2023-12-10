import { Parser } from "expr-eval";
import type { TransformedVariables } from "../types/Page";

export function evaluteExpression(value: string, variables: TransformedVariables) {
  try {
    return Parser.evaluate(value, variables);
  } catch(err) {
    console.error(err);
    return 0;
  }
}
