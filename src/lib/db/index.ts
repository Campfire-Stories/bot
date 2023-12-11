import { eq, and } from "drizzle-orm";
import { db } from "./database";
import { pages, stories, users, userVars } from "./models";
import { transformUser } from "./transform";

export async function getBookFirstPage(bookId: number) {
  return (
    await db
      .select({ firstPageId: stories.firstPageId })
      .from(stories)
      .where(eq(stories.bookId, bookId))
      .limit(1)
  )[0]?.firstPageId;
}

export async function getBook(bookId: number) {
  return (
    await db
      .select()
      .from(stories)
      .where(eq(stories.bookId, bookId))
      .limit(1)
  )[0];
}

export async function getPage(bookId: number, pageId: number) {
  return (
    await db
      .select()
      .from(pages)
      .where(
        and(
          eq(pages.bookId, bookId),
          eq(pages.pageId, pageId)
        )
      ).limit(1)
  )[0];
}

export async function getUser(userId: string) {
  const user = (
    await db
      .select()
      .from(users)
      .where(eq(users.userId, BigInt(userId)))
      .limit(1)
  )[0];

  if (!user) return null;
  return transformUser(user);
}

export async function setUserBook(userId: string, bookId: number, channelId: string, messageId: string) {
  const pageId = await getBookFirstPage(bookId);
  if (typeof pageId !== "number") return null;

  const channelIdBigInt = BigInt(channelId);
  const messageIdBigInt = BigInt(messageId);

  await db
    .insert(users)
    .values({
      userId: BigInt(userId),
      bookId,
      pageId,
      channelId: channelIdBigInt,
      messageId: messageIdBigInt,
    })
    .onDuplicateKeyUpdate({
      set: {
        bookId,
        pageId,
        channelId: channelIdBigInt,
        messageId: messageIdBigInt,
      },
    });
  
  return pageId;
}

export async function setUserPage(userId: string, pageId: number) {
  await db
    .update(users)
    .set({ pageId })
    .where(eq(users.userId, BigInt(userId)));
}

export async function setUserMessage(userId: string, channelId: string, messageId: string) {
  await db
    .update(users)
    .set({ channelId: BigInt(channelId), messageId: BigInt(messageId) })
    .where(eq(users.userId, BigInt(userId)));
}

export async function getUserVariables(userId: string) {
  return await db
    .select()
    .from(userVars)
    .where(
      and(
        eq(userVars.userId, BigInt(userId))
      )
    );
}

export async function setUserVariable(userId: string, name: string, value: number) {
  if (!isNaN(value)) {
    // Enforcing MySQL limits
    if (value < -2147483648) value = -2147483648;
    if (value > 2147483647) value = 2147483647;

    // If the value isn't NaN, insert or update the row
    await db
      .insert(userVars)
      .values({
        userId: BigInt(userId),
        name,
        value
      })
      .onDuplicateKeyUpdate({
        set: { value }
      });
  } else {
    // If the value is NaN, delete the row, because the value of an unset value is NaN
    await db
      .delete(userVars)
      .where(
        and(
          eq(userVars.userId, BigInt(userId)),
          eq(userVars.name, name),
        )
      );
  }
}

export async function resetUserVariables(userId: string) {
  return await db
    .delete(userVars)
    .where(
      eq(userVars.userId, BigInt(userId)),
    );
}
