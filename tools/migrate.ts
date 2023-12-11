import env from "../src/lib/env";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

(async () => {
  const connection = await mysql.createConnection({
    host: env.DatabaseHost,
    port: env.DatabasePort,
    user: env.DatabaseUser,
    password: env.DatabasePassword,
    database: env.DatabaseName,
    waitForConnections: true,
    supportBigNumbers: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  
  const db = drizzle(connection);
  await migrate(db, { migrationsFolder: "drizzle/migrations" });
  connection.end();
})();
