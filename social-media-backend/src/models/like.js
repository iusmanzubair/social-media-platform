import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const like = db.define("like", {
    likeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ["userId", "postId"]
        }
    ],
    tableName: "likes"
})

like.associate = (models) => {
    like.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "CASCADE"
    })

    like.belongsTo(models.post, {
        foreignKey: "postId",
        onDelete: "CASCADE"
    })

    like.belongsTo(models.reply, {
        foreignKey: "replyId",
        onDelete: "CASCADE"
    })
}