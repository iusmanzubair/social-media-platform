import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const follow = db.define("follow", {
  followId: {
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
      fields: ["followerId", "followingId"]
    }
  ],
  validate: {
    cannotFollowSelf() {
      if (this.followId === this.followingId)
        throw new Error("A user cannot follow themselves")
    }
  },
  tableName: "follows"
})

follow.associate = (models) => {
  follow.belongsTo(models.user, {
    foreignKey: "followerId",
    as: "followers",
    onDelete: "CASCADE"
  })

  follow.belongsTo(models.user, {
    foreignKey: "followingId",
    as: "following",
    onDelete: "CASCADE"
  })
}
