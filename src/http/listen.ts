import { client } from "./client";
import { getUser } from "../lib/db";

client.on("interactionCreate", async interaction => {
  if (interaction.commandName === "story") {
    const user = await getUser(interaction.member.id);
    return interaction.reply({
      content: "conos",
      ephemeral: true,
    });
  }
});

client.start().then(() => {
  console.log("Bot started");
});