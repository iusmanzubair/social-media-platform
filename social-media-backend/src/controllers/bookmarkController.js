import { bookmark } from "../models/bookmark.js";
import { post } from "../models/post.js";
import { reply } from "../models/reply.js";

export const fetchBookmarks = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const { userId } = req.user

    const bookmarks = await bookmark.findAll({
      include: [
        {
          association: "post",
          include: [
            {
              association: "user",
              attributes: ["userId", "username", "name", "profileImageUrl"]
            },
            {
              association: "media",
              attributes: ["mediaId", "url", "createdAt", "mediaType"]
            }
          ]
        },
        {
          association: "reply",
          include: [
            {
              association: "user",
              attributes: ["userId", "username", "name", "profileImageUrl"]
            },
            {
              association: "media",
              attributes: ["mediaId", "url", "createdAt", "mediaType"]
            }
          ]
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(page - 1) * parseInt(limit),
      where: { userId }
    });

    const parsedBookmarks = JSON.parse(JSON.stringify(bookmarks))
    const posts = parsedBookmarks.map(bookmark => {
      if (bookmark.post === null)
        return bookmark.reply
      else
        return bookmark.post
    })

    res.status(200).json({
      success: true,
      nextPage: parseInt(page) + 1,
      hasMore: (bookmarks.length > 0),
      posts
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch bookmarks"
    })

  }
}

export const fetchBookmarksIdOnly = async (req, res) => {
  try {
    const { userId } = req.user;

    const _bookmarkedPosts = await bookmark.findAll({
      where: {
        userId
      },
      attributes: ["postId"]
    })

    const bookmarkedPosts = _bookmarkedPosts.map(post => post.postId)

    res.status(200).json({
      success: true,
      bookmarkedPosts
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch bookmarked post",
    });
  }
}

export const fetchReplyBookmarksIdOnly = async (req, res) => {
  try {
    const { userId } = req.user;

    const _bookmarkedReplies = await bookmark.findAll({
      where: {
        userId
      },
      attributes: ["replyId"]
    })

    const bookmarkedReplies = _bookmarkedReplies.map(reply => reply.replyId)

    res.status(200).json({
      success: true,
      bookmarkedPosts: bookmarkedReplies
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch bookmarked replies",
    });
  }
}

export const createBookmark = async (req, res) => {
  try {
    const { objectId, type } = req.body;
    const { userId } = req.user

    if (!objectId || (type != "ADD" && type != "REMOVE")) {
      return res.status(400).json({
        success: false,
        message: "Unable to bookmark a post",
      });
    }

    const dbPost = await post.findOne({
      where: { postId: objectId }
    })

    if (!dbPost || dbPost.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to bookmark a post",
      });
    }

    if (type === "ADD") {
      await bookmark.create(
        {
          userId,
          postId: objectId
        },
      );
    } else {
      await bookmark.destroy(
        {
          where: {
            userId,
            postId: objectId
          },
        },
      )

    }

    res.status(200).json({
      success: true,
      message: "Post bookmarked successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to bookmark a post",
    });
  }
}

export const createReplyBookmark = async (req, res) => {
  try {
    const { objectId, type } = req.body;
    const { userId } = req.user

    if (!objectId || (type != "ADD" && type != "REMOVE")) {
      return res.status(400).json({
        success: false,
        message: "Unable to bookmark a reply",
      });
    }

    const dbReply = await reply.findOne({
      where: { replyId: objectId }
    })

    if (!dbReply || dbReply.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to bookmark a reply",
      });
    }

    if (type === "ADD") {
      await bookmark.create(
        {
          userId,
          replyId: objectId
        },
      );
    } else {
      await bookmark.destroy(
        {
          where: {
            userId,
            replyId: objectId
          },
        },
      )

    }

    res.status(200).json({
      success: true,
      message: "Reply bookmarked successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to bookmark a reply",
    });
  }
}
