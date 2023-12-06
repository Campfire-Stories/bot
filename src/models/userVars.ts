import {
  bigint,
  int,
  varchar,
  mysqlTable,
} from "drizzle-orm/mysql-core";

import { users } from "./users";

export const userVars = mysqlTable(
  "user_vars",
  {
    userId: bigint("guild_id", { mode: "bigint", unsigned: true }).primaryKey().references(() => users.userId),
    key: varchar("key", { length: 128 }).notNull(),
    value: int("value").notNull().default(0),
  },
);
