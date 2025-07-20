import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const block = db.define("block",{
    blockId: {
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
            fields: ["blockerId", "blockedId"]
        }
    ], 
    validate: {
       cannotBlockSelf() {
        if(this.blockerId === this.blockedId)
            throw new Error("A user cannot block themselves")
       } 
    },
    tableName: "blocks"
})

block.associate = (models) => {
    block.belongsTo(models.user, {
        foreignKey: "blockerId",
        onDelete: "CASCADE"
    })

    block.belongsTo(models.user, {
        foreignKey: "blockedId",
        onDelete: "CASCADE"
    })
}