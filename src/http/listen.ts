import { Embed } from "interactions.js";
import { client } from "./client";
import { getStory, setUserStory, getPage, resetUserVariables } from "../lib/db";
import { handleVariables } from "../func/handleVariables";
import { handleStory } from "../func/handleStory";

client.on("interactionCreate", async interaction => {
  if (interaction.commandName === "story") {
    interaction.deferReply();

    const subcommand = interaction.options.data[0];
    switch(subcommand.name) {
      case "continue":
        return handleStory(interaction);
      
      case "new": {
        const storyId = subcommand.options[0].value;
        
        const pageId = await setUserStory(interaction.member.id, storyId);
        if (typeof pageId !== "number") return interaction.editReply({
          content: "The story with the given ID doesn't exist",
        });
        
        await resetUserVariables(interaction.member.id);
        
        const pageInfo = await getPage(storyId, pageId);
        const variables = await handleVariables(pageInfo, interaction.member.id);
  
        return handleStory(interaction, variables);
      }

      case "info": {
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
  }
});

client.start().then(() => {
  console.log("Bot started");
});
