import { Router } from "express";
import { generateSignedUrl } from "../controllers/mediaController.js";

const router = Router();

router.post("/generate-signed-url", generateSignedUrl);

export { router as mediaRoutes };
