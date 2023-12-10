import {
  bigint,
  varchar,
  int,
  foreignKey,
  mysqlTable,
} from "drizzle-orm/mysql-core";

import { pages } from "./pages";

export const users = mysqlTable(
  "users",
  {
    userId: bigint("user_id", { mode: "bigint", unsigned: true }).notNull().primaryKey(),
    bookId: int("book_id").notNull(),
    pageId: int("page_id").notNull(),
    
    channelId: varchar("channel_id", { length: 128 }).notNull(),
    messageId: varchar("message_id", { length: 128 }).notNull(),

    // channelId: bigint("channel_id", { mode: "bigint", unsigned: true }).notNull(),
    // messageId: bigint("message_id", { mode: "bigint", unsigned: true }).notNull(),
  },
  (table) => ({
    reference: foreignKey({
      columns: [table.bookId, table.pageId],
      foreignColumns: [pages.bookId, pages.pageId],
    })
  }),
);
