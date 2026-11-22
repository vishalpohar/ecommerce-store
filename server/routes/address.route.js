import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
} from "../controllers/address.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, addAddress);
router.get("/", protectRoute, getAddress);
router.delete("/", protectRoute, deleteAddress);

export default router;
