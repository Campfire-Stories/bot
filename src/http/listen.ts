import { Embed } from "interactions.js";
import { Parser } from "expr-eval";
import { client } from "./client";
import { getUser, getStory, setUserStory, getPage, getUserVariables, setUserVariable, resetUserVariables } from "../lib/db";
import { Page, TransformedVariables } from "../types/Page";

client.on("interactionCreate", async interaction => {
  if (interaction.commandName === "story") {
    interaction.deferReply();

    const subcommand = interaction.options.data[0];

    if (subcommand.name === "continue") {
      return handleStory(interaction);
    } else if (subcommand.name === "new") {
      const storyId = subcommand.options[0].value;
      
      const pageId = await setUserStory(interaction.member.id, storyId);
      if (typeof pageId !== "number") return interaction.editReply({
        content: "The story with the given ID doesn't exist",
      });
      
      await resetUserVariables(interaction.member.id);
      
      const pageInfo = await getPage(storyId, pageId);
      const variables = await preDisplayPageActions(pageInfo, interaction.member.id);

      return handleStory(interaction, variables);
    } else if (subcommand.name === "info") {
      const storyId = subcommand.options[0].value;
      const storyInfo = await getStory(storyId);

      if (!storyInfo) return interaction.editReply({
        content: "The story with the given ID doesn't exist",
      });
      
      return interaction.editReply({
        embeds: [
          new Embed()
            .setColor(storyInfo.color.toString(16))
            .setAuthor(storyInfo.name, "", "")
            .setDescription(storyInfo.description)
        ],
      });
    }
  }
});

async function handleStory(interaction: any, variables?: TransformedVariables) {
  const userId = interaction.member.id;
  const user = await getUser(userId);

  if (!user) return interaction.editReply({
    embeds: [
      new Embed()
        .setColor("#ED4245")
        .setAuthor("You currently haven't started a story yet.", "", "")
        .setDescription("Use </story new:1183161784207675463> to start a story!")
    ],
  });

  const storyId = user.storyId;
  const pageId = user.pageId;

  return await displayPage(interaction, storyId, pageId, variables);
}

async function transformUserVariables(userId: string) {
  const variables: TransformedVariables = {};
  for (const { name, value } of await getUserVariables(userId)) {
    variables[name] = value;
  }
  return variables;
}

async function preDisplayPageActions(page: Page, userId: string) {
  const variables = await transformUserVariables(userId);
  for (const { name, condition, value } of page.vars) {
    if (evaluate(condition, variables)) {
      await setUserVariable(
        userId,
        name,
        variables[name] = Number(evaluate(value, variables)),
      );
    }
  }
  return variables;
}

function evaluate(value: string, variables: { [key: string]: number }) {
  try {
    return Parser.evaluate(value, variables);
  } catch(err) {
    console.error(err);
    return 0;
  }
}

async function displayPage(interaction: any, storyId: number, pageId: number, fetchedVariables?: TransformedVariables) {
  const pageInfo = await getPage(storyId, pageId);

  if (!pageInfo) return interaction.editReply({
    content: `Missing page ID. (Story ID: \`${storyId}\` | Page ID: \`${pageId}\`)`,
  });

  if (!pageInfo.embeds!.length) {
    return interaction.editReply({
      content: `Missing embeds. (Story ID: \`${storyId}\` | Page ID: \`${pageId}\`)`,
    });
  }

  const variables = fetchedVariables || transformUserVariables(interaction.member.id);
  for (const choice of pageInfo.choices) {
    // choice.isVisibleCondition
  }
  
  return interaction.editReply({
    embeds: pageInfo.embeds,
  });
}

client.start().then(() => {
  console.log("Bot started");
});
