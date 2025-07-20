import { db } from "../config/db.js";
import { media } from "../models/media.js";
import { post } from "../models/post.js";
import { reply } from "../models/reply.js";

export const createReply = async (req, res) => {
  const t = await db.transaction();
  try {
    const { content, uploadedUrls, mediaType, postId } = req.body;

    if (
      (!content && uploadedUrls.length === 0) ||
      content.length > 300 ||
      uploadedUrls.length > 2 ||
      !mediaType
    ) {
      return res.status(400).json({
        success: false,
        message: "Unable to process your request",
      });
    }

    const dbPost = await post.findByPk(postId, { transaction: t });

    if (!dbPost || dbPost.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to post a reply",
      });
    }

    await dbPost.increment("replyCount", { transaction: t });

    const dbReply = await reply.create(
      {
        content,
        userId: req.user.userId,
        postId,
      },
      {
        transaction: t,
      }
    );

    for (const url of uploadedUrls) {
      await media.create(
        {
          url,
          mediaType,
          userId: req.user.userId,
          replyId: dbReply.replyId,
        },
        {
          transaction: t,
        }
      );
    }

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Unable to post a reply",
    });
  }
};

export const createChildReply = async (req, res) => {
  const t = await db.transaction();
  try {
    const {
      content,
      uploadedUrls,
      mediaType,
      parentReplyId: replyId,
    } = req.body;

    if (
      (!content && uploadedUrls.length === 0) ||
      content.length > 300 ||
      uploadedUrls.length > 2 ||
      !mediaType
    ) {
      return res.status(400).json({
        success: false,
        message: "Unable to process your request",
      });
    }

    const parentReply = await reply.findByPk(replyId, { transaction: t });

    if (!parentReply || parentReply.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to post a reply",
      });
    }

    await parentReply.increment("replyCount", { transaction: t });

    const dbReply = await reply.create(
      {
        content,
        userId: req.user.userId,
        parentReplyId: replyId,
      },
      {
        transaction: t,
      }
    );

    uploadedUrls.forEach(async (url) => {
      await media.create(
        {
          url,
          mediaType,
          userId: req.user.userId,
          replyId: dbReply.replyId,
        },
        {
          transaction: t,
        }
      );
    });

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Unable to post a reply",
    });
  }
};

export const fetchReplies = async (req, res) => {
  try {
    const { limit, page, postId, parentReplyId } = req.query;

    if (!limit || !page || (!postId && !parentReplyId)) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch replies",
      });
    }

    let whereClause;
    if (postId) {
      whereClause = {
        postId,
      };
    } else {
      whereClause = {
        parentReplyId,
      };
    }

    const replies = await reply.findAll({
      include: [
        {
          association: "user",
          attributes: ["userId", "username", "name", "profileImageUrl"],
        },
        {
          association: "media",
          attributes: ["mediaId", "url", "createdAt", "mediaType"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(page - 1) * parseInt(limit),
      where: whereClause,
    });

    res.status(200).json({
      success: true,
      nextPage: parseInt(page) + 1,
      hasMore: replies.length > 0,
      posts: replies,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Unable to fetch replies",
    });
  }
};

export const fetchReply = async (req, res) => {
  try {
    const { replyId } = req.query;

    const dbReply = await reply.findByPk(replyId, {
      include: [
        {
          association: "user",
          attributes: ["userId", "username", "name", "profileImageUrl"],
        },
        {
          association: "media",
          attributes: ["mediaId", "url", "createdAt", "mediaType"],
        },
      ],
    });

    if (!dbReply) {
      return res.status(400).json({
        success: false,
        message: "Reply not found",
      });
    }
    res.status(200).json({
      success: true,
      post: dbReply,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Unable to fetch reply",
    });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { objectId: replyId } = req.query;
    const dbReply = await reply.findByPk(replyId);

    if (!dbReply) {
      return res.status(400).json({
        success: false,
        message: "Reply does not exists"
      })
    }

    dbReply.destroy();

    res.status(200).json({
      success: true,
      message: "Reply deleted successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to delete reply"
    })
  }
}

