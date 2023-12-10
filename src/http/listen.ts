import { Embed } from "interactions.js";
import { client } from "./client";
import { getBook, setUserBook, getPage, resetUserVariables } from "../lib/db";
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

        const pageId = await setUserBook(interaction.member.id, bookId, message.id); // WIP
        if (typeof pageId !== "number") return interaction.editReply({
          content: "The story with the given book ID doesn't exist",
        });
        
        await resetUserVariables(interaction.member.id);
        
        const pageInfo = await getPage(bookId, pageId);
        const variables = await handleVariables(pageInfo, interaction.member.id);
  
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
});

client.start().then(() => {
  console.log("Bot started");
});
