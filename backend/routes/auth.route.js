import express from "express";
import {
  getProfile,
  login,
  logout,
  refreshToken,
  resetPassword,
  sendOTP,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);
router.post("/send-otp", sendOTP);
router.post("/reset-password", resetPassword);

export default router;
