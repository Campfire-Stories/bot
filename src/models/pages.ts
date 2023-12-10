import {
  int,
  json,
  primaryKey,
  mysqlTable,
} from "drizzle-orm/mysql-core";
import type { APIEmbed } from "discord-api-types/v10";

import { stories } from "./books";
import type { PageVar, PageChoice } from "../types/Page";

export const pages = mysqlTable(
  "pages",
  {
    bookId: int("book_id").notNull().references(() => stories.bookId),
    pageId: int("page_id").notNull(),
    
    embeds: json("embeds").notNull().$type<APIEmbed[]>().default([]),

    vars: json("vars_actions").notNull().$type<PageVar[]>().default([]),
    choices: json("choices").notNull().$type<PageChoice[]>().default([]),
  },
  (table) => ({
    pk: primaryKey({
      name: "users_pk",
      columns: [table.bookId, table.pageId],
    }),
  }),
);
