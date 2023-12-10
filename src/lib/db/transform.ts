export function transformUser(user: { bookId: number, userId: bigint, pageId: number }) {
  return {
    bookId: user.bookId as number,
    userId: user.userId.toString(),
    pageId: user.pageId as number,
  };
}
