import { client } from "./client";
import { getUser, getStory } from "../lib/db";

client.on("interactionCreate", async interaction => {
  if (interaction.commandName === "story") {
    interaction.deferReply();

    const subcommand = interaction.options.data[0];

    if (subcommand.name === "continue") {
      const user = await getUser(interaction.member.id);

      if (!user) return interaction.editReply({
        content: "missing user lol no story",
        ephemeral: true,
      });

      return interaction.editReply({
        content: JSON.stringify(user),
        ephemeral: true,
      });
    } else if (subcommand.name === "new") {
      const storyId = subcommand.options[0].value;
      const storyInfo = await getStory(storyId);

      if (!storyInfo) return interaction.editReply({
        content: "story no exist :(",
        ephemeral: true,
      });

      console.log(JSON.stringify(storyInfo))
      
      return interaction.editReply({
        content: JSON.stringify(storyInfo),
        ephemeral: true,
      });
    }
  }
});

client.start().then(() => {
  console.log("Bot started");
});