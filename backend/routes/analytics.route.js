import express from "express";
import { sellerRoute, protectRoute } from "../middlewares/auth.middleware.js";
import { getStats } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute, sellerRoute, getStats);

export default router;
