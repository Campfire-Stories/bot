import { APIMessage } from "discord-api-types/v10";

const URL = "https://discord.com/api/v10";

export async function getOriginalInteractionResponse(applicationId: string, interactionToken: string): Promise<APIMessage | null> {
  try {
    return (await fetch(`${URL}/webhooks/${applicationId}/${interactionToken}/messages/@original`)).json();
  } catch(err) {
    console.error(err);
    return null;
  }
}