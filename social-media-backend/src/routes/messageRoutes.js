import { Router } from "express";
import { createConversation, createMessage, fetchConversations, fetchMessages } from "../controllers/messageController.js";

const router = Router();

router.post("/create-conversation", createConversation);
router.post("/create-message", createMessage);
router.get("/fetch-conversations", fetchConversations);
router.get("/fetch-messages", fetchMessages);

export { router as messageRoutes };
