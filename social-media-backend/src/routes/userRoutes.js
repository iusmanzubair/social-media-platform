import express from "express";
import { checkUser, createUser, getAllUsers, getUserByUsername, login, logout, UserExists, verifyOtp } from "../controllers/userController.js";

const router = express.Router();

router.post("/create", createUser);
router.post("/verify-otp", verifyOtp);
router.post("/check-user", checkUser);
router.post("/user-exists", UserExists);
router.post("/login", login);
router.post("/logout", logout);

router.get("/get-session", (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user ? { userId: req.user.userId, email: req.user.email } : null
  })
})

router.get("/get-user", (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      userId: req.user.userId,
      email: req.user.email,
      username: req.user.username,
      name: req.user.name,
      bio: req.user.bio,
      profileImageUrl: req.user.profileImageUrl,
      coverImageUrl: req.user.coverImageUrl,
      isActive: req.user.isActive,
      isVerified: req.user.isVerified,
      isPrivate: req.user.isPrivate
    }
  })
})

router.get("/get-all-users", getAllUsers);
router.get("/get-user-by-username", getUserByUsername);

export { router as userRoutes };
