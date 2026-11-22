import express from "express";
import { generateDescription } from "../controllers/ai.controller.js";
import { protectRoute, sellerRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/generate-description", protectRoute, sellerRoute, generateDescription);

export default router