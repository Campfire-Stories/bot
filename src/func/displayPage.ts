import { ActionRow, Button } from "interactions.js";
import { getPage, setUserMessage } from "../lib/db";
import { evaluteExpression } from "./evaluteExpression";
import { transformVariables } from "./transformVariables";
import type { TransformedVariables } from "../types/Page";

export async function displayPage(interaction: any, user: { bookId: number; pageId: number; messageId: string; }, fetchedVariables?: TransformedVariables) {
  const { bookId, pageId, messageId } = user;
  const pageInfo = await getPage(bookId, pageId);

  if (!pageInfo) return interaction.editReply({
    content: `Missing page ID. (Book ID: \`${bookId}\` | Page ID: \`${pageId}\`)`,
  });

  if (!pageInfo.embeds!.length) {
    return interaction.editReply({
      content: `Missing embeds. (Book ID: \`${bookId}\` | Page ID: \`${pageId}\`)`,
    });
  }

  const variables = fetchedVariables || await transformVariables(interaction.user.id);
  const components = [];
  for (const choice of pageInfo.choices) {
    if (evaluteExpression(choice.isVisibleCondition, variables)) {
      if (components.length % 5 === 0) {
        components.push(new ActionRow());
      }

      const actionRow = components[components.length - 1];
      const button = new Button();

      if (choice.style) button.setStyle(choice.style);
      if (choice.emoji) button.setEmoji(choice.emoji);
      if (choice.label) button.setLabel(choice.label);

      button.setDisabled(!choice.gotos.find(({ condition }) => evaluteExpression(condition, variables)));
      button.setCustomId(`choice-${interaction.user.id}-${pageInfo.choices.indexOf(choice)}`);
      
      actionRow.addComponent(button);
    }
  }
  
  const message = await interaction.editReply({
    embeds: pageInfo.embeds,
    components,
  });

  if (message.id !== messageId) {
    await setUserMessage(interaction.user.id, message.channelId, message.id);
  }
}
