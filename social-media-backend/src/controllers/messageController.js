import { Op } from "sequelize"
import { conversation } from "../models/conversation.js"
import { message } from "../models/messages.js"
import { db } from "../config/db.js"
import { media } from "../models/media.js"

export const createConversation = async (req, res) => {
  try {
    const { user2Id } = req.body
    const { userId: user1Id } = req.user

    const dbConversation = await conversation.findOne({
      where: {
        user1Id,
        user2Id
      }
    })

    if (dbConversation) {
      return res.status(200).json({
        success: true,
        conversationId: dbConversation.conversationId
      })
    }

    const newConversation = await conversation.create({
      user1Id,
      user2Id
    })

    return res.status(200).json({
      success: false,
      conversationId: newConversation.conversationId
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to bookmark a post",
    });
  }
}

export const fetchConversations = async (req, res) => {
  try {
    const { userId } = req.user;

    const dbConversation = await conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: [
        {
          association: "user1",
          where: {
            userId: {
              [Op.ne]: userId
            }
          },
          required: false,
          attributes: ["userId", "username", "name", "bio", "profileImageUrl", "createdAt"]
        },
        {
          association: "user2",
          where: {
            userId: {
              [Op.ne]: userId
            }
          },
          required: false,
          attributes: ["userId", "username", "name", "bio", "profileImageUrl", "createdAt"]
        },
      ],
      attributes: ["conversationId"]
    })

    const _conversations = dbConversation.map((conversation) => {
      const { user1, user2, ...rest } = conversation.get({ plain: true });

      return {
        ...rest,
        user: user1 ?? user2
      }
    })

    console.log(_conversations)

    res.status(200).json({
      success: true,
      conversations: _conversations
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to bookmark a post",
    });
  }
}

export const fetchMessages = async (req, res) => {
  try {
    const { conversationId } = req.query
    const { userId } = req.user

    const dbConversation = await conversation.findByPk(conversationId, {
      include: [
        {
          association: "user1",
          where: {
            userId: {
              [Op.ne]: userId
            }
          },
          required: false,
          attributes: ["userId", "username", "name", "bio", "profileImageUrl", "createdAt"]
        },
        {
          association: "user2",
          where: {
            userId: {
              [Op.ne]: userId
            }
          },
          required: false,
          attributes: ["userId", "username", "name", "bio", "profileImageUrl", "createdAt"]
        },
      ]
    });

    if (!dbConversation) {
      return res.status(400).json({
        success: false,
        message: "No conversation found"
      })
    }

    const dbMessages = await message.findAll({
      where: { conversationId },
      include: [
        {
          association: "media",
          attributes: ["mediaId", "url"]
        }
      ],
      order: [["createdAt", "ASC"]]
    })

    res.status(200).json({
      success: true,
      messages: {
        user: dbConversation.user1 ?? dbConversation.user2,
        data: dbMessages
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to bookmark a post",
    });
  }
}

export const createMessage = async (req, res) => {
  const t = await db.transaction();
  try {
    const { content, uploadedUrls, mediaType, conversationId } = req.body;

    if ((!content && uploadedUrls.length === 0) || content.length > 300 || uploadedUrls.length > 2 || !mediaType) {
      return res.status(400).json({
        success: false,
        message: "Unable to process your request",
      });
    }

    const dbMessage = await message.create({
      content,
      senderId: req.user.userId,
      conversationId
    },
      { transaction: t }
    );


    for (const url of uploadedUrls) {
      await media.create({
        url,
        mediaType,
        userId: req.user.userId,
        messageId: dbMessage.messageId
      }, { transaction: t });
    };

    await t.commit();

    res.status(200).json({
      success: true,
      message: "Message created successfully"
    })
  } catch (error) {
    await t.rollback()
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to create message"
    })
  }
};
