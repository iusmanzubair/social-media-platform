import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const notification = db.define(
  "notification",
  {
    notificationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("like", "post", "reply", "follow", "mention"),
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    objectId: {
      type: DataTypes.UUID,
    },
    objectType: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "notifications",
  }
);

notification.associate = (models) => {
  notification.belongsTo(models.user, {
    foreignKey: "recipientId",
    onDelete: "CASCADE",
  });

  notification.belongsTo(models.user, {
    foreignKey: "senderId",
    onDelete: "CASCADE",
  });
};
