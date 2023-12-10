import { Parser } from "expr-eval";

export function evaluteVariables(value: string, variables: { [key: string]: number }) {
  try {
    return Parser.evaluate(value, variables);
  } catch(err) {
    console.error(err);
    return 0;
  }
}
