import { db } from "../config/db.js";
import { media } from "../models/media.js";
import { post } from "../models/post.js";

export const createPost = async (req, res) => {
  const t = await db.transaction();
  try {
    const { content, uploadedUrls, mediaType } = req.body;

    if ((!content && uploadedUrls.length === 0) || content.length > 300 || uploadedUrls.length > 2 || !mediaType) {
      return res.status(400).json({
        success: false,
        message: "Unable to process your request",
      });
    }

    const dbPost = await post.create({
      content,
      userId: req.user.userId,
    }, { transaction: t });


    for (const url of uploadedUrls) {
      await media.create({
        url,
        mediaType,
        userId: req.user.userId,
        postId: dbPost.postId
      }, { transaction: t });
    };

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Post added successfully"
    })
  } catch (error) {
    await t.rollback();
    res.status(400).json({
      success: false,
      message: "Unable to create post"
    })
  }
};

export const fetchPosts = async (req, res) => {
  try {
    const { limit, page, userId } = req.query;

    let whereClause;
    if (userId) {
      whereClause = {
        userId
      }
    }

    const posts = await post.findAll({
      include: [
        {
          association: "user",
          attributes: ["userId", "username", "name", "profileImageUrl"]
        },
        {
          association: "media",
          attributes: ["mediaId", "url", "createdAt", "mediaType"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(page - 1) * parseInt(limit),
      where: whereClause
    });

    res.status(200).json({
      success: true,
      nextPage: parseInt(page) + 1,
      hasMore: (posts.length > 0),
      posts
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch posts"
    })
  }
}

export const fetchPost = async (req, res) => {
  try {
    const { postId } = req.query;

    const dbPost = await post.findOne({
      include: [
        {
          association: "user",
          attributes: ["userId", "username", "name", "profileImageUrl"]
        },
        {
          association: "media",
          attributes: ["mediaId", "url", "createdAt", "mediaType"]
        }
      ],
      where: { postId }
    });

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found"
      })
    }
    res.status(200).json({
      success: true,
      post: dbPost
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch post"
    })
  }
}

export const deletePost = async (req, res) => {
  try {
    const { objectId: postId } = req.query;
    const dbPost = await post.findByPk(postId);

    if (!dbPost) {
      return res.status(400).json({
        success: false,
        message: "Post does not exists"
      })
    }

    await post.destroy({
      where: { postId }
    })

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to delete post"
    })
  }
}

