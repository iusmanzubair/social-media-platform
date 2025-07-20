import { Router } from "express";
import { createBookmark, createReplyBookmark, fetchBookmarks, fetchBookmarksIdOnly, fetchReplyBookmarksIdOnly } from "../controllers/bookmarkController.js";

const router = Router();

router.get("/fetch-bookmarks", fetchBookmarks);
router.get("/fetch-bookmarks-id", fetchBookmarksIdOnly);
router.get("/fetch-reply-bookmarks-id", fetchReplyBookmarksIdOnly);
router.post("/create-bookmark", createBookmark);
router.post("/create-reply-bookmark", createReplyBookmark);

export { router as bookmarkRoutes };
