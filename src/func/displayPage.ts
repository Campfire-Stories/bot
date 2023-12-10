import { ActionRow, Button } from "interactions.js";
import { Interpreter, RandomParser, RangeParser, FiftyFiftyParser, IfStatementParser, SliceParser, StrictVarsParser, IntegerTransformer, StringTransformer } from 'tagscript';
import { getPage, setUserMessage } from "../lib/db";
import { evaluteExpression } from "./evaluteExpression";
import { transformVariables } from "./transformVariables";
import type { TransformedVariables } from "../types/Page";

const ts = new Interpreter(new SliceParser(), new FiftyFiftyParser(), new RangeParser(), new RandomParser(), new IfStatementParser(), new StrictVarsParser());

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
  const transformedVariables: { [key: string]: IntegerTransformer | StringTransformer} = {};
  for (const [key, value] of Object.entries(variables)) {
    transformedVariables[key] = new IntegerTransformer(`${value}`);
  }

  transformedVariables["userId"] = new StringTransformer(interaction.user.id);

  const parseText = async (text: string) => (await ts.run(text, transformedVariables)).body || "An unexpected error has occurred while parsing text";

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
      if (choice.label) button.setLabel(await parseText(choice.label));

      button.setDisabled(!choice.gotos.find(({ condition }) => evaluteExpression(condition, variables)));
      button.setCustomId(`choice-${interaction.user.id}-${pageInfo.choices.indexOf(choice)}`);
      
      actionRow.addComponent(button);
    }
  }

  const embeds = pageInfo.embeds;
  for (const embed of pageInfo.embeds) {
    if (embed.title) embed.title = await parseText(embed.title);
    if (embed.description) embed.description = await parseText(embed.description);
    if (embed.author) {
      if (embed.author?.name) embed.author.name = await parseText(embed.author.name);
      if (embed.author?.url) embed.author.url = await parseText(embed.author.url);
      if (embed.author?.icon_url) embed.author.icon_url = await parseText(embed.author.icon_url);
    }
    if (embed.url) embed.url = await parseText(embed.url);
    if (embed.fields) {
      for (const field of embed.fields) {
        if (field?.name) field.name = await parseText(field.name);
        if (field?.value) field.value = await parseText(field.value);
      }
    }
    if (embed.image) {
      if (embed.image?.url) embed.image.url = await parseText(embed.image.url);
    }
    if (embed.thumbnail) {
      if (embed.thumbnail?.url) embed.thumbnail.url = await parseText(embed.thumbnail.url);
    }
    if (embed.footer) {
      if (embed.footer?.text) embed.footer.text = await parseText(embed.footer.text);
      if (embed.footer?.icon_url) embed.footer.icon_url = await parseText(embed.footer.icon_url);
    }
  }
  
  const message = await interaction.editReply({
    embeds,
    components,
  });

  if (message.id !== messageId) {
    await setUserMessage(interaction.user.id, message.channelId, message.id);
  }
}
