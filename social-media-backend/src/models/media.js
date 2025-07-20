import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const media = db.define(
  "media",
  {
    mediaId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM("image", "video", "gif"),
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
    },
    height: {
      type: DataTypes.INTEGER,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    altText: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "media",
  }
);

media.associate = (models) => {
  media.belongsTo(models.post, {
    foreignKey: "postId",
    onDelete: "CASCADE"
  })

  media.belongsTo(models.reply, {
    foreignKey: "replyId",
    onDelete: "CASCADE"
  })

  media.belongsTo(models.user, {
    foreignKey: "userId",
    onDelete: "CASCADE"
  })

  media.belongsTo(models.message, {
    foreignKey: "messageId",
    onDelete: "CASCADE"
  })
}
