import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const bookmark = db.define(
  "bookmark",
  {
    bookmarkId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
  },
  {
    indexes: [
        {
            unique: true,
            fields: ["userId", "postId"]
        }
    ],
    tableName: "bookmarks"
  }
);

bookmark.associate = (models) => {
    bookmark.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "CASCADE"
    })

    bookmark.belongsTo(models.post, {
        foreignKey: "postId",
        onDelete: "CASCADE"
    })

    bookmark.belongsTo(models.reply, {
        foreignKey: "replyId",
        onDelete: "CASCADE"
    })
}
