import env from "../lib/env";
import { Application } from "interactions.js";

export const client = new Application({
  port: env.AppPort,
  botToken: env.DiscordBotToken,
  publicKey: env.DiscordPublicKey,
  applicationId: env.DiscordClientId,
});

client.on("debug", debug => console.log(debug));
