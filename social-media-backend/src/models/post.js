import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const post = db.define(
  "post",
  {
    postId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    replyCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  },
  {
    tableName: "posts"
  }
)

post.associate = (models) => {
  post.belongsTo(models.user, {
    foreignKey: 'userId',
    onDelete: "CASCADE"
  });

  post.hasMany(models.media, {
    foreignKey: "postId",
    onDelete: "CASCADE"
  })

  post.hasMany(models.like, {
    foreignKey: "postId",
    onDelete: "CASCADE"
  })

  post.hasMany(models.bookmark, {
    foreignKey: "postId",
    onDelete: "CASCADE"
  })

  post.hasMany(models.reply, {
    foreignKey: "postId",
    onDelete: "CASCADE"
  })
}
