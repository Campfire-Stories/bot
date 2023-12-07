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
    userId: bigint("user_id", { mode: "bigint", unsigned: true }).primaryKey().references(() => users.userId),
    name: varchar("name", { length: 128 }).notNull(),
    value: int("value").notNull().default(0),
  },
);
