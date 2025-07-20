export type Post = {
  replyId?: string
  postId?: string,
  content: string,
  likeCount: number,
  viewCount: number,
  replyCount: number,
  createdAt: string,
  updatedAt: string,
  userId: string,
  media: [
    {
      mediaId: string,
      mediaType: string,
      url: string,
      createdAt: string
    }
  ],
  user: {
    userId: string,
    name: string,
    username: string,
    profileImageUrl: string
  }
}

export type UserType = {
  userId: string,
  email: string,
  username: string,
  name: string,
  bio: string,
  profileImageUrl: string,
  coverImageUrl: string,
  isActive: boolean,
  isVerified: boolean,
  isPrivate: boolean,
  createdAt: string
}

export type ConversationType = {
  conversationId: string,
  user: Pick<UserType, "userId" | "name" | "username" | "profileImageUrl">
}

export type MessageType = {
  data: [
    {
      messageId: string,
      senderId: string,
      content: string,
      conversationId: string,
      isRead: boolean,
      createdAt: string,
      updatedAt: string,
      media: [
        {
          mediaId: string,
          url: string,
        }
      ]
    }
  ],
  user: {
    userId: string,
    username: string,
    name: string,
    bio: string,
    profileImageUrl: string,
    createdAt: string
  }
}
