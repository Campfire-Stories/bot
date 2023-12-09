import { eq, and } from "drizzle-orm";
import { db } from "./database";
import { pages, stories, users, userVars } from "./models";

export async function getStoryFirstPage(storyId: number) {
  return (
    await db
      .select({ firstPage: stories.firstPage })
      .from(stories)
      .where(eq(stories.storyId, storyId))
      .limit(1)
  )[0]?.firstPage;
}

export async function getStory(storyId: number) {
  return (
    await db
      .select()
      .from(stories)
      .where(eq(stories.storyId, storyId))
      .limit(1)
  )[0];
}

export async function getPage(storyId: number, pageId: number) {
  return (
    await db
      .select()
      .from(pages)
      .where(
        and(
          eq(pages.storyId, storyId),
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

  return {
    storyId: user.storyId,
    userId: user.userId.toString(),
    pageId: user.pageId,
  };
}

export async function setUserStory(userId: string, storyId: number) {
  const pageId = await getStoryFirstPage(storyId);
  if (typeof pageId !== "number") return false;

  await db
    .insert(users)
    .values({
      userId: BigInt(userId),
      storyId,
      pageId
    })
    .onDuplicateKeyUpdate({
      set: {
        storyId,
        pageId
      }
    });
  return true;
}

export async function setUserPage(userId: string, pageId: number) {
  await db
    .update(users)
    .set({ pageId })
    .where(eq(users.userId, BigInt(userId)));
}

export async function getUserVar(userId: string, name: string) {
  return (
    await db
      .select()
      .from(userVars)
      .where(
        and(
          eq(userVars.userId, BigInt(userId)),
          eq(userVars.name, name)
        )
      )
      .limit(1)
  )[0] || 0;
}

export async function setUserVar(userId: string, name: string, value: number) {
  if (value != 0) {
    // Enforcing MySQL limits
    if (value < -2147483648) value = -2147483648;
    if (value < 2147483647) value = 2147483647;

    // If the value isn't 0, insert or update the row
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
    // If the value is 0, delete the row, because the value of an unset value is 0
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
