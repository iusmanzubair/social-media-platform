import crypto from "crypto";
import { otp } from "../models/otp.js";
import bcrypt from "bcryptjs";

export const generateOtp = async (email) => {
  try {
    const newOtp = crypto.randomInt(100000, 999999).toString();

    const hashedOtp = await bcrypt.hash(newOtp, 10);

    await otp.create({
      email,
      otp: hashedOtp,
    });

    return newOtp
  } catch (error) {
    console.error(error)
    throw error
  }
};
