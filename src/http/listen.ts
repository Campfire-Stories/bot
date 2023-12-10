import { Embed } from "interactions.js";
import { client } from "./client";
import { getBook, setUserBook, getPage, resetUserVariables } from "../lib/db";
import { handleVariables } from "../func/handleVariables";
import { handleBook } from "../func/handleBook";

client.on("interactionCreate", async interaction => {
  if (interaction.commandName === "story") {
    interaction.deferReply();

    const subcommand = interaction.options.data[0];
    switch(subcommand.name) {
      case "continue":
        return handleBook(interaction);
      
      case "new": {
        const bookId = subcommand.options[0].value;
        
        const pageId = await setUserBook(interaction.member.id, bookId);
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
