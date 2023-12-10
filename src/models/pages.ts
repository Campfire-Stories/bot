import {
  int,
  json,
  primaryKey,
  mysqlTable,
} from "drizzle-orm/mysql-core";
import type { APIEmbed } from "discord-api-types/v10";

import { stories } from "./stories";
import type { PageVar, PageChoice } from "../types/Page";

export const pages = mysqlTable(
  "pages",
  {
    storyId: int("story_id").notNull().references(() => stories.storyId),
    pageId: int("page_id").notNull(),
    
    embeds: json("embeds").notNull().$type<APIEmbed[]>().default([]),

    vars: json("vars_actions").notNull().$type<PageVar[]>().default([]),
    choices: json("choices").notNull().$type<PageChoice[]>().default([]),
  },
  (table) => ({
    pk: primaryKey({
      name: "users_pk",
      columns: [table.storyId, table.pageId],
    }),
  }),
);
