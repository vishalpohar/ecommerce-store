import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";

const SIZE_OPTIONS_BY_CATEGORY = {
  shirts: ["S", "M", "L", "XL", "XXL"],
  "t-shirts": ["S", "M", "L", "XL", "XXL"],
  jackets: ["S", "M", "L", "XL", "XXL"],
  pants: ["28", "30", "32", "34", "36", "38"],
  shoes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
  suits: ["38", "40", "42", "44", "46"],
  bags: ["One Size"],
  glasses: ["One Size"],
};

async function backfillSizes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const [category, sizes] of Object.entries(SIZE_OPTIONS_BY_CATEGORY)) {
      const result = await Product.updateMany(
        { category: new RegExp(`^${category}$`, "i") },
        { $set: { sizes } },
      );
      console.log(`${category}: updated ${result.modifiedCount} products`);
    }

    // Clear stale Redis cache so featured products include sizes
    await redis.del("featured_products");
    console.log("Cleared featured_products Redis cache");

    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
}

backfillSizes();
