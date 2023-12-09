export default {
  AppClusters: parseInt(process.env["APP_CLUSTERS"] as string) ?? 0,
  AppPort: parseInt(process.env["APP_PORT"] as string) ?? 3000,

  DiscordBotToken: process.env["DISCORD_TOKEN"] as string,
  DiscordPublicKey: process.env["DISCORD_PUBLIC_KEY"] as string,
  DiscordClientId: process.env["DISCORD_CLIENT_ID"] as string,

  DatabaseHost: process.env["DATABASE_HOST"] as string,
  DatabasePort: parseInt(process.env["DATABASE_PORT"] as string) ?? 3306,
  DatabaseUser: process.env["DATABASE_USER"] as string,
  DatabasePassword: process.env["DATABASE_PASSWORD"] as string,
  DatabaseName: process.env["DATABASE_NAME"] as string,
};
