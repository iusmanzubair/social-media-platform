import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const user = db.define(
  "user",
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    profileImageUrl: {
      type: DataTypes.STRING,
    },
    coverImageUrl: {
      type: DataTypes.STRING,
    },
    birthdate: {
      type: DataTypes.DATEONLY,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

user.associate = (models) => {
  user.hasMany(models.post, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  user.hasMany(models.media, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  user.hasMany(models.like, {
    foreignKey: "userId",
    onDelete: "CASCADE"
  })

  user.hasMany(models.bookmark, {
    foreignKey: "userId",
    onDelete: "CASCADE"
  })

  user.hasMany(models.reply, {
    foreignKey: "userId",
    onDelete: "CASCADE"
  })

  user.hasMany(models.follow, {
    foreignKey: "followerId",
    as: "followers",
    onDelete: "CASCADE"
  })

  user.hasMany(models.follow, {
    foreignKey: "followingId",
    as: "following",
    onDelete: "CASCADE"
  })

  user.hasMany(models.block, {
    foreignKey: "blockerId",
    onDelete: "CASCADE"
  })

  user.hasMany(models.block, {
    foreignKey: "blockedId",
    onDelete: "CASCADE"
  })

  user.hasMany(models.notification, {
    foreignKey: "recipientId",
    onDelete: "CASCADE"
  })

  user.hasMany(models.notification, {
    foreignKey: "senderId",
    onDelete: "CASCADE"
  })

  user.hasMany(models.conversation, {
    foreignKey: "user1Id",
    as: "user1",
    onDelete: "CASCADE"
  })

  user.hasMany(models.conversation, {
    foreignKey: "user2Id",
    as: "user2",
    onDelete: "CASCADE"
  })

  user.hasMany(models.message, {
    foreignKey: "senderId",
    onDelete: "CASCADE"
  })
};
