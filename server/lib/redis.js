import Redis from "ioredis";
import logger from "../utils/logger.js";

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  password: process.env.UPSTASH_REDIS_TOKEN,
  tls: {},
  lazyConnect: true
});

export const connectRedis = async () => {
  try {
    await redis.connect();
    logger.info("Redis connected");
  } catch (error) {
    logger.error(`Redis connection failed: ${error.message}`);
    throw error;
  }
};

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});
