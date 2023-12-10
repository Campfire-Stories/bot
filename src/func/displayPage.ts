import { getPage } from "../lib/db";
import { transformVariables } from "./transformVariables";
import type { TransformedVariables } from "../types/Page";

export async function displayPage(interaction: any, storyId: number, pageId: number, fetchedVariables?: TransformedVariables) {
  const pageInfo = await getPage(storyId, pageId);

  if (!pageInfo) return interaction.editReply({
    content: `Missing page ID. (Story ID: \`${storyId}\` | Page ID: \`${pageId}\`)`,
  });

  if (!pageInfo.embeds!.length) {
    return interaction.editReply({
      content: `Missing embeds. (Story ID: \`${storyId}\` | Page ID: \`${pageId}\`)`,
    });
  }

  const variables = fetchedVariables || transformVariables(interaction.member.id);
  for (const choice of pageInfo.choices) {
    // choice.isVisibleCondition
  }
  
  return interaction.editReply({
    embeds: pageInfo.embeds,
  });
}
