import { Router } from "express";
import { createLike, createReplyLike, fetchLikedPosts, fetchLikedReplies } from "../controllers/LikesController.js";

const router = Router();

router.get("/fetch-likes", fetchLikedPosts);
router.get("/fetch-reply-likes", fetchLikedReplies);
router.post("/create-like", createLike);
router.post("/create-reply-like", createReplyLike);

export { router as likeRoutes };
