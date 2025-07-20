import { Router } from "express";
import { createPost, deletePost, fetchPost, fetchPosts } from "../controllers/postController.js";

const router = Router();

router.post("/create-post", createPost)
router.get("/fetch-posts", fetchPosts)
router.get("/fetch-post", fetchPost)
router.delete("/delete-post", deletePost)

export { router as postRoutes }
