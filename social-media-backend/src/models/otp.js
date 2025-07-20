import { DataTypes } from "sequelize";
import { db } from "../config/db.js";

export const otp = db.define(
  "otp",
  {
    otpId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(Date.now() + 5 * 60 * 1000),
      allowNull: false,
    },
  },
  {
    tableName: "otps",
  }
);
