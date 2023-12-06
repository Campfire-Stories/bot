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
    storyId: int("story_id").references(() => stories.storyId),
    pageId: int("page_id"),
    
    embeds: json("embeds").$type<APIEmbed[]>().default([]),

    vars: json("vars_actions").$type<PageVar[]>().default([]),
    choices: json("choices").$type<PageChoice[]>().default([]),
  },
  (table) => ({
    pk: primaryKey({
      name: "users_pk",
      columns: [table.storyId, table.pageId],
    }),
  }),
);
