import { setUserVariable } from "../lib/db";
import { evaluteVariables } from "./evaluteVariables";
import { transformVariables } from "./transformVariables";
import type { Page } from "../types/Page";

export async function handleVariables(page: Page, userId: string) {
  const variables = await transformVariables(userId);
  for (const { name, condition, value } of page.vars) {
    if (evaluteVariables(condition, variables)) {
      await setUserVariable(
        userId,
        name,
        variables[name] = Number(evaluteVariables(value, variables)),
      );
    }
  }
  return variables;
}