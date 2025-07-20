import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const messageAttachment = db.define("messageAttachment", {
    messageAttachmentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileType: {
        type: DataTypes.ENUM("image", "video", "file"),
        allowNull: false
    },
    fileSize: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: "messageAttachments"
})

messageAttachment.associate = (models) => {
    messageAttachment.belongsTo(models.message, {
        foreignKey: "messageId",
        onDelete: "CASCADE"
    })
}