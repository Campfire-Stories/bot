import { ChannelManager } from "interactions.js";
import { client } from "../http/client";

export async function expireOldButtons(interaction: any, channelId: string, messageId: string) {
  try {
    const channelManager = new ChannelManager(client, channelId);
    await channelManager.editMessage(
      channelId,
      messageId,
      {
        components: interaction.message.components.map((c: { type: number; components: { disabled: boolean }[] }) => {
          if (c.type === 1) {
            for (const components of c.components) {
              components.disabled = true;
            }
          }
          return c;
        })
      },
    );
  } catch(err) {
    console.error(err);
  }
}
