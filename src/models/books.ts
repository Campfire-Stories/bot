import {
  int,
  varchar,
  mysqlTable,
} from "drizzle-orm/mysql-core";

export const stories = mysqlTable(
  "books",
  {
    bookId: int("book_id").notNull().primaryKey(),
    firstPageId: int("page_id").notNull().default(0),

    color: int("color").notNull().default(0xFFFFFF),
    name: varchar("name", { length: 256 }).notNull().default("A book name has not been set"),
    description: varchar("description", { length: 4096 }).notNull().default("A description has not been set"),
  },
);
