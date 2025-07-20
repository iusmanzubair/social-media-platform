import { user } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendConfirmationEmail } from "../services/send-email.js";
import { generateOtp } from "../services/generate-otp.js";
import { otp } from "../models/otp.js";
import { Op } from "sequelize";
import { post } from "../models/post.js";
import { follow } from "../models/follow.js";

dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { username, email, password, name, bio } = req.body;

    let dbUser = await user.findOne({
      where: { username }
    })

    if (dbUser) {
      return res.status(400).json({
        success: false,
        message: "username is not available"
      })
    }

    dbUser = await user.findOne({
      where: { email }
    })

    if (dbUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    dbUser = await user.create({
      username,
      email,
      name,
      bio,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: dbUser.userId,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to create user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const dbUser = await user.findOne({
      where: {
        email,
      },
    });

    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exists",
      });
    }

    const passwordMatch = await bcrypt.compare(password, dbUser.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect credentials",
      });
    }

    const token = jwt.sign(
      {
        id: dbUser.userId,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000,
    });

    console.log(token);

    res.status(200).json({
      success: true,
      message: "Login successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to login",
    });
  }
};

export const checkUser = async (req, res) => {
  try {
    const { email } = req.body;
    const dbUser = await user.findOne({
      where: {
        email,
      },
    });

    if (!dbUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exists",
      });
    }

    res.status(200).json({
      success: true,
      message: "Uses exists",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const UserExists = async (req, res) => {
  try {
    const { email } = req.body;
    const dbUser = await user.findOne({
      where: {
        email,
      },
    });

    if (dbUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otpUser = await otp.findOne({
      where: {
        email,
      },
    });

    if (!otpUser) {
      const _otp = await generateOtp(email);
      await sendConfirmationEmail(email, _otp);
    }

    res.status(200).json({
      success: true,
      message: "Confirmation email sent successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, _otp } = req.body;

    const dbOtp = await otp.findOne({
      where: {
        email,
      },
    });

    if (!dbOtp) {
      return res.status(401).json({
        success: false,
        message: "Otp does not exists",
      });
    }

    const isValid = new Date(dbOtp.expiresAt) > new Date(Date.now());
    if (!isValid) {
      await dbOtp.destroy();

      return res.status(401).json({
        success: false,
        message: "Otp expired"
      })
    }

    const matchOtp = await bcrypt.compare(_otp, dbOtp.otp);
    if (!matchOtp) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Otp",
      });
    }

    await dbOtp.destroy();

    res.status(200).json({
      success: true,
      message: "Otp verified successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Unable to send email",
    });
  }
};

export const logout = async (_, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { limit } = req.query;
    const users = await user.findAll({
      order: [["createdAt", "ASC"]],
      limit: parseInt(limit),
      where: {
        userId: {
          [Op.ne]: req.user.userId
        }
      }
    })

    res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch users"
    })
  }
}

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const dbUser = await user.findOne({
      where: {
        username
      },
      attributes: { exclude: ["password"] },
    })

    const postCount = await post.count({
      where: {
        userId: dbUser.userId
      }
    })

    const followerCount = await follow.count({
      where: {
        followingId: dbUser.userId
      }
    })

    const followingCount = await follow.count({
      where: {
        followerId: dbUser.userId
      }
    })

    res.status(200).json({
      success: true,
      user: {
        details: dbUser,
        postCount,
        followerCount,
        followingCount
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Unable to fetch user"
    })
  }
}
