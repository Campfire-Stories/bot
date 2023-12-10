import {
  int,
  varchar,
  mysqlTable,
} from "drizzle-orm/mysql-core";

export const stories = mysqlTable(
  "stories",
  {
    storyId: int("story_id").notNull().primaryKey(),

    color: int("color").notNull().default(0xFFFFFF),
    name: varchar("name", { length: 256 }).notNull().default("A story name has not been set"),
    description: varchar("description", { length: 4096 }).notNull().default("A description has not been set"),

    firstPage: int("first_page").notNull().default(0),
  },
);
