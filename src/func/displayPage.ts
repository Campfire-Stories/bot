import { getPage } from "../lib/db";
import { evaluteExpression } from "./evaluteExpression";
import { transformVariables } from "./transformVariables";
import type { TransformedVariables } from "../types/Page";

export async function displayPage(interaction: any, bookId: number, pageId: number, fetchedVariables?: TransformedVariables) {
  const pageInfo = await getPage(bookId, pageId);

  if (!pageInfo) return interaction.editReply({
    content: `Missing page ID. (Book ID: \`${bookId}\` | Page ID: \`${pageId}\`)`,
  });

  if (!pageInfo.embeds!.length) {
    return interaction.editReply({
      content: `Missing embeds. (Book ID: \`${bookId}\` | Page ID: \`${pageId}\`)`,
    });
  }

  const variables = fetchedVariables || await transformVariables(interaction.member.id);
  for (const choice of pageInfo.choices) {
    if (evaluteExpression(choice.isVisibleCondition, variables)) {

    }
  }
  
  return interaction.editReply({
    embeds: pageInfo.embeds,
  });
}
