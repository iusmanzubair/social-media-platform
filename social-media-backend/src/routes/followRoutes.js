import { Router } from "express";
import { createFollow, fetchFollowers, fetchFollowing, fetchFollowingIdOnly } from "../controllers/followController.js";

const router = Router();

router.get("/fetch-following", fetchFollowing);
router.get("/fetch-followers", fetchFollowers);
router.get("/fetch-following-id", fetchFollowingIdOnly);
router.post("/create-follow", createFollow);

export { router as followRoutes };
