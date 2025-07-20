import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const reply = db.define(
  "reply",
  {
    replyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    replyCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "replies",
  }
);

reply.associate = (models) => {
  reply.belongsTo(models.user, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  reply.hasMany(models.media, {
    foreignKey: "replyId",
    onDelete: "CASCADE"
  })

  reply.hasMany(models.like, {
    foreignKey: "replyId",
    onDelete: "CASCADE"
  })

  reply.hasMany(models.bookmark, {
    foreignKey: "replyId",
    onDelete: "CASCADE"
  })

  reply.belongsTo(models.post, {
    foreignKey: "postId",
    onDelete: "CASCADE",
  });

  reply.belongsTo(models.reply, {
    foreignKey: "parentReplyId",
    onDelete: "CASCADE",
  });

  reply.hasMany(models.reply, {
    foreignKey: "parentReplyId",
    onDelete: "CASCADE",
  });
};
