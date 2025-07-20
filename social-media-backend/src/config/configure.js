import { db } from "./db.js";
import { user } from "../models/user.js";
import { post } from "../models/post.js";
import dotenv from "dotenv";
import { media } from "../models/media.js";
import { like } from "../models/like.js";
import { bookmark } from "../models/bookmark.js";
import { reply } from "../models/reply.js";
import { follow } from "../models/follow.js";
import { block } from "../models/block.js";
import { notification } from "../models/notification.js";
import { conversation } from "../models/conversation.js";
import { message } from "../models/messages.js";
import { messageAttachment } from "../models/messageAttachment.js";
import { otp } from "../models/otp.js";

dotenv.config();

export const models = {
  user,
  post,
  media,
  like,
  bookmark,
  reply,
  follow,
  block,
  notification,
  conversation,
  message,
  messageAttachment,
  otp
}

export const initializeDatabase = async () => {
  Object.values(models).forEach(model => {
    if (model.associate)
      model.associate(models);
  })
  try {
    await db.authenticate();
    console.log("Connection has been established successfully");

    await db.sync();
    console.log("Database synced");
  } catch (error) {
    console.log("Unable to connect to database", error);
    throw error
  }
};
