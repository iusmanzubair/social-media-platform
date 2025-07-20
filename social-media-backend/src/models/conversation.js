import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const conversation = db.define(
  "conversation",
  {
    conversationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
  },
  {
    tableName: "conversations"
  }
);

conversation.associate = (models) => {
  conversation.belongsTo(models.user, {
    foreignKey: "user1Id",
    as: "user1",
    onDelete: "CASCADE"
  })

  conversation.belongsTo(models.user, {
    foreignKey: "user2Id",
    as: "user2",
    onDelete: "CASCADE"
  })

  conversation.hasMany(models.message, {
    foreignKey: "conversationId",
    onDelete: "CASCADE"
  })
}
