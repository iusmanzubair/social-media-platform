import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { user } from "../models/user.js";
import { authRoutes, publicRoutes } from "../utils/routes.js";

dotenv.config()

export const verifyToken = async (req, res, next) => {
  try {
    console.log(req.path)
    if (publicRoutes.includes(req.path))
      return next();

    const token = req.cookies.token;
    if (authRoutes.includes(req.path)) {
      return token ? res.status(400).json({
        success: false,
        message: "Already logged in"
      }) : next();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied",
      });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await user.findByPk(decoded.id)

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist"
      })
    }

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    })
  }
};
