import { Embed } from "interactions.js";
import { client } from "./client";
import { getUser, getStory, setUserStory } from "../lib/db";

client.on("interactionCreate", async interaction => {
  if (interaction.commandName === "story") {
    interaction.deferReply();

    const userId = interaction.member.id;
    const subcommand = interaction.options.data[0];

    if (subcommand.name === "continue") {
      const user = await getUser(userId);

      if (!user) return interaction.editReply({
        embeds: [
          new Embed()
            .setColor("#ED4245")
            .setAuthor("You currently haven't started a story yet.", "", "")
            .setDescription("Use </story new:1183161784207675463> to start a story!")
        ],
      });

      return interaction.editReply({
        content: JSON.stringify(user),
      });
    } else if (subcommand.name === "new") {
      const storyId = subcommand.options[0].value;
      const success = await setUserStory(userId, storyId);

      if (!success) return interaction.editReply({
        content: "The story with the given ID doesn't exist",
      });
      
      return interaction.editReply({
        content: "(play game here)", // WIP
      });
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
            .setFooter(`DEBUG MODE: story id - ${storyInfo.storyId}`, "")
        ],
      });
    }
  }
});

client.start().then(() => {
  console.log("Bot started");
});