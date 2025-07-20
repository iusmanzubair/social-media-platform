import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const message = db.define("message", {
  messageId: {
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
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "messages"
})

message.associate = (models) => {
  message.belongsTo(models.user, {
    foreignKey: "senderId",
    onDelete: "CASCADE"
  })

  message.belongsTo(models.conversation, {
    foreignKey: "conversationId",
    onDelete: "CASCADE"
  })

  message.hasMany(models.media, {
    foreignKey: "messageId",
    onDelete: "CASCADE"
  })
}

