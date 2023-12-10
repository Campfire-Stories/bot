import { Embed } from "interactions.js";
import { client } from "./client";
import { getBook, getPage, getUser, setUserBook, setUserPage, resetUserVariables } from "../lib/db";
import { handleVariables } from "../func/handleVariables";
import { handleBook } from "../func/handleBook";
import { transformVariables } from "../func/transformVariables";
import { evaluteExpression } from "../func/evaluteExpression";
import { expireOldButtons } from "../func/expireOldButtons";

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isCommand("story")) {
      interaction.deferReply();
  
      const subcommand = interaction.options.data[0];
      switch(subcommand.name) {
        case "continue": 
          return handleBook(interaction);
        
        case "new": {
          const bookId = subcommand.options[0].value;
  
          const pageId = await setUserBook(interaction.user.id, bookId, "0", "0");
          if (typeof pageId !== "number") return interaction.editReply({
            content: "The story with the given book ID doesn't exist",
          });
          
          await resetUserVariables(interaction.user.id);
          
          const pageInfo = await getPage(bookId, pageId);
          const variables = await handleVariables(interaction.user.id, pageInfo);
    
          return handleBook(interaction, variables, true);
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
        
        const customId = interaction.data.custom_id.slice("choice-".length);
        const userId = customId.split("-")[0];
        const choiceNumber = customId.slice(userId.length + 1);
  
        if (userId !== interaction.user.id) return interaction.editReply({
          content: "This is not your interaction!",
        });
  
        const user = await getUser(userId);
        if (!user || user.messageId !== interaction.message.id) {
          if (user) expireOldButtons(interaction, interaction.message.channelId, interaction.message.id);
          return interaction.editReply({
            content: "The game session of the message expired.",
          });
        }
  
        const pageInfo = await getPage(user.bookId, user.pageId);
        if (!pageInfo) return interaction.editReply({
          content: `Missing page ID. (Book ID: \`${user.bookId}\` | Page ID: \`${user.pageId}\`)`
        });
  
        const choice = pageInfo.choices[choiceNumber];
        if (!choice) return interaction.editReply({
          content: `Missing choice. (Book ID: \`${user.bookId}\` | Page ID: \`${user.pageId}\` | Choice Index: \`${choiceNumber}\`)`
        });
  
        const variables = await transformVariables(userId);
        for (const { condition, pageId } of choice.gotos) {
          if (evaluteExpression(condition, variables)) {
            const pageInfo = await getPage(user.bookId, pageId);
            if (!pageInfo) return interaction.editReply({
              content: `Missing new page ID. (Book ID: \`${user.bookId}\` | Page ID: \`${user.pageId}\` | New Page ID: \`${pageId}\`)`
            });

            await setUserPage(userId, pageId);
            await handleVariables(userId, pageInfo);
            handleBook(interaction, variables);
            return expireOldButtons(interaction, interaction.message.channelId, interaction.message.id);
          }
        }
  
        interaction.editReply({ content: 'You cannot select that choice!' });
      }
    }
  } catch(err) {
    console.error(err);
  }
});

client.start().then(() => {
  console.log("Bot started");
});
