import { Embed } from "interactions.js";
import { getUser } from "../lib/db";
import { displayPage } from "./displayPage";
import type { TransformedVariables } from "../types/Page";

export async function handleBook(interaction: any, variables?: TransformedVariables, newStory = false) {
  const user = await getUser(interaction.user.id);

  if (!user) return interaction.editReply({
    embeds: [
      new Embed()
        .setColor("#ED4245")
        .setAuthor("You currently haven't started a story yet.", "", "")
        .setDescription("Use </story new:1183161784207675463> to start a story!")
    ],
  });

  return await displayPage(interaction, user, variables);
}
