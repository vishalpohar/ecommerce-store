import Redis from "ioredis";
import logger from "../utils/logger.js";

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  password: process.env.UPSTASH_REDIS_TOKEN,
  tls: {},
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});
