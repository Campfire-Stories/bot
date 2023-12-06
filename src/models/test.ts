import {
  varchar,
  mysqlTable,
} from "drizzle-orm/mysql-core";

export const characterItems = mysqlTable(
  "test",
  {
    test: varchar("test", { length: 128 }).notNull(),
  },
);
