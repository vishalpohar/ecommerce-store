import express from "express";
import "dotenv/config";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import addressRoutes from "./routes/address.route.js";
import aiRoutes from "./routes/ai.route.js";

import { connectDB } from "./lib/db.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/ai", aiRoutes);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

async function server() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

server();
