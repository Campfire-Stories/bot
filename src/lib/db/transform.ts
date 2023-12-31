export function transformUser(user: { bookId: number; userId: bigint; pageId: number; channelId: bigint; messageId: bigint }) {
  return {
    bookId: user.bookId as number,
    userId: user.userId.toString(),
    pageId: user.pageId as number,
    channelId: user.channelId.toString(),
    messageId: user.messageId.toString(),
  };
}
