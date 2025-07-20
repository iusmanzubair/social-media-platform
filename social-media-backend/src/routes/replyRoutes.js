import { Router } from "express";
import { createChildReply, createReply, deleteReply, fetchReplies, fetchReply } from "../controllers/replyController.js";

const router = Router();

router.post("/create-reply", createReply)
router.post("/create-child-reply", createChildReply)
router.get("/fetch-replies", fetchReplies)
router.get("/fetch-reply", fetchReply)
router.delete("/delete-reply", deleteReply)

export { router as replyRoutes }

