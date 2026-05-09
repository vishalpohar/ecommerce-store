import Redis from "ioredis";
import envars from "./enVars.js";

export const redis = new Redis(envars.upstash_redis_url, {
  password: envars.upstash_redis_token,
  tls: {},
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});
