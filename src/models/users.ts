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
    storyId: int("story_id").notNull(),
    pageId: int("page_id").notNull(),
  },
  (table) => ({
    reference: foreignKey({
      columns: [table.storyId, table.pageId],
      foreignColumns: [pages.storyId, pages.pageId],
    })
  }),
);
