import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.GOOGLE_APP_PASSWORD, 
  },
});

export const sendConfirmationEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: '"UK" <usmanzubair091@gmail.com>',
      to: email,
      subject: "Confirmation Code",
      html: `Your UK verification code is: ${otp}`,
    });
    console.log("Confirmation email sent!");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};