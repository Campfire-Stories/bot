import { Parser } from "expr-eval";
import type { TransformedVariables } from "../types/Page";

export function evaluteExpression(value: string, variables: TransformedVariables, name?: string) {
  try {
    const extendedVariables = { ...variables };
    if (name && !extendedVariables[name]) {
      extendedVariables[name] = 0;
    }
    return Parser.evaluate(value, extendedVariables);
  } catch(err) {
    console.error(err);
    return 0;
  }
}
