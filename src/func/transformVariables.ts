import { getUserVariables } from "../lib/db";
import type { TransformedVariables } from "../types/Page";

export async function transformVariables(userId: string) {
  const variables: TransformedVariables = {};
  for (const { name, value } of await getUserVariables(userId)) {
    variables[name] = value;
  }
  return variables;
}
