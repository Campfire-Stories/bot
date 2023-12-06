import env from "./src/lib/env";

module.exports = {
  schema: "./src/models/**/*",
  out: "./drizzle/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: env.DatabaseHost,
    user: env.DatabaseUser,
    password: env.DatabasePassword,
    database: env.DatabaseName,
  },
};
