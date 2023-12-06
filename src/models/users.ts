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
    userId: bigint("guild_id", { mode: "bigint", unsigned: true }).primaryKey(),
    storyId: int("story_id"),
    pageId: int("page_id"),
  },
  (table) => ({
    reference: foreignKey({
      columns: [table.storyId, table.pageId],
      foreignColumns: [pages.storyId, pages.pageId],
    })
  }),
);
