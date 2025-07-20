import { db } from "../config/db.js";
import { like } from "../models/like.js"
import { post } from "../models/post.js";
import { reply } from "../models/reply.js";

export const createLike = async (req, res) => {
  const t = await db.transaction();

  try {
    const { objectId, type } = req.body;
    const { userId } = req.user

    if (!objectId || (type != "LIKE" && type != "NOLIKE")) {
      return res.status(400).json({
        success: false,
        message: "Unable to like a post",
      });
    }

    const dbPost = await post.findOne({
      where: { postId: objectId }
    })

    if (!dbPost || dbPost.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to like a post",
      });
    }


    if (type === "LIKE") {
      await like.create(
        {
          userId,
          postId: objectId
        },
        { transaction: t }
      );

      await dbPost.increment('likeCount', { transaction: t })
    } else {
      await like.destroy(
        {
          where: {
            userId,
            postId: objectId
          },
          transaction: t
        },
      )

      await dbPost.decrement('likeCount', { transaction: t })
    }

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Post liked successfully",
    });
  } catch (error) {
    await t.rollback();

    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to like a post",
    });
  }
}

export const createReplyLike = async (req, res) => {
  const t = await db.transaction();

  try {
    const { objectId, type } = req.body;
    const { userId } = req.user

    if (!objectId || (type != "LIKE" && type != "NOLIKE")) {
      return res.status(400).json({
        success: false,
        message: "Unable to like a reply",
      });
    }

    const dbReply = await reply.findOne({
      where: { replyId: objectId }
    })

    if (!dbReply || dbReply.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to like a reply",
      });
    }


    if (type === "LIKE") {
      await like.create(
        {
          userId,
          replyId: objectId
        },
        { transaction: t }
      );

      await dbReply.increment('likeCount', { transaction: t })
    } else {
      await like.destroy(
        {
          where: {
            userId,
            replyId: objectId
          },
          transaction: t
        },
      )

      await dbReply.decrement('likeCount', { transaction: t })
    }

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Reply liked successfully",
    });
  } catch (error) {
    await t.rollback();

    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to like a reply",
    });
  }
}

export const fetchLikedPosts = async (req, res) => {
  try {
    const { userId } = req.user;

    const _likedPosts = await like.findAll({
      where: {
        userId
      },
      attributes: ["postId"]
    })

    const likedPosts = _likedPosts.map(post => post.postId)
    console.log(likedPosts)
    res.status(200).json({
      success: true,
      likedPosts
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch liked post",
    });
  }
}

export const fetchLikedReplies = async (req, res) => {
  try {
    const { userId } = req.user;

    const _likedReplies = await like.findAll({
      where: {
        userId
      },
      attributes: ["replyId"]
    })

    const likedReplies = _likedReplies.map(reply => reply.replyId)
    res.status(200).json({
      success: true,
      likedPosts: likedReplies
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch liked reply",
    });
  }
}

