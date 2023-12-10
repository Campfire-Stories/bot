import { Embed } from "interactions.js";
import { client } from "./client";
import { getBook, getPage, getUserByMessageId, setUserBook, resetUserVariables } from "../lib/db";
import { handleVariables } from "../func/handleVariables";
import { getOriginalInteractionResponse } from "../func/getOriginalInteractionResponse";
import { handleBook } from "../func/handleBook";

client.on("interactionCreate", async interaction => {
  if (interaction.isCommand("story")) {
    interaction.deferReply();

    const subcommand = interaction.options.data[0];
    switch(subcommand.name) {
      case "continue":
        return handleBook(interaction);
      
      case "new": {
        const bookId = subcommand.options[0].value;
        
        const message = await getOriginalInteractionResponse(interaction.client.applicationId, interaction.token);
        if (!message) return interaction.editReply({
          content: "An unexpected error has occured.",
        });

        const pageId = await setUserBook(interaction.user.id, bookId, message.id); // WIP
        if (typeof pageId !== "number") return interaction.editReply({
          content: "The story with the given book ID doesn't exist",
        });
        
        await resetUserVariables(interaction.user.id);
        
        const pageInfo = await getPage(bookId, pageId);
        const variables = await handleVariables(pageInfo, interaction.user.id);
  
        return handleBook(interaction, variables);
      }

      case "info": {
        const bookId = subcommand.options[0].value;
        const bookInfo = await getBook(bookId);
  
        if (!bookInfo) return interaction.editReply({
          content: "The story with the given book ID doesn't exist",
        });
        
        return interaction.editReply({
          embeds: [
            new Embed()
              .setColor(bookInfo.color.toString(16))
              .setAuthor(bookInfo.name, "", "")
              .setDescription(bookInfo.description)
          ],
        });
      }
    }
  }

  if (interaction.isComponent()) {
    if (interaction.data?.custom_id && interaction.data.custom_id.startsWith("choice-")) {
      interaction.deferReply();

      const user = await getUserByMessageId(interaction.message.id);
      if (!user) return interaction.editReply({ content: "This is not your interaction!" });
      if (user.userId !== interaction.user.id) return interaction.editReply({ content: "This is not your interaction!" });

      const page = await getPage(user.bookId, user.pageId);
      if (!page) return interaction.editReply({
        content: `Missing page ID. (Book ID: \`${user.bookId}\` | Page ID: \`${user.pageId}\`)`
      });

      const choiceNumber = interaction.data.custom_id.slice("choice-".length);
      const choice = page.choices[choiceNumber];
      if (!choice) return interaction.editReply({
        content: `Missing choice. (Book ID: \`${user.bookId}\` | Page ID: \`${user.pageId}\` | Choice Index: \`${choiceNumber}\`)`
      });

      console.log(choice);
      interaction.editReply('wowie');
    }
  }
});

client.start().then(() => {
  console.log("Bot started");
});
