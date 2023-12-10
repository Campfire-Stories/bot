import { setUserVariable } from "../lib/db";
import { evaluteExpression } from "./evaluteExpression";
import { transformVariables } from "./transformVariables";
import type { Page } from "../types/Page";

export async function handleVariables(page: Page, userId: string) {
  const variables = await transformVariables(userId);
  for (const { name, condition, value } of page.vars) {
    if (evaluteExpression(condition, variables)) {
      await setUserVariable(
        userId,
        name,
        variables[name] = Number(evaluteExpression(value, variables)),
      );
    }
  }
  return variables;
}
