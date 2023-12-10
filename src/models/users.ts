import {
  bigint,
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
    messageId: bigint("message_id", { mode: "bigint", unsigned: true }).notNull(),
  },
  (table) => ({
    reference: foreignKey({
      columns: [table.bookId, table.pageId],
      foreignColumns: [pages.bookId, pages.pageId],
    })
  }),
);
