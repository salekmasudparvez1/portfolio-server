import Redis from "ioredis";
import config from "./app/config";

const isProduction = config.NODE_ENV === "production";

export const redis = new Redis({
  host: isProduction ? config.REDIS_HOST_URL : "127.0.0.1",
  port: Number(config.REDIS_PORT) || 6379,
  ...(config.REDIS_PASSWORD && { password: config.REDIS_PASSWORD }),
  ...(isProduction && config.REDIS_TLS === "true" ? { tls: {} } : {}),
  maxRetriesPerRequest: null, // Prevent crashes if Redis temporarily unavailable
  retryStrategy: (times) => {
    console.log(`Redis reconnecting... attempt ${times}`);
    return Math.min(times * 50, 2000);
  },
});

redis.on("connect", () => console.log("✅ Redis connected successfully"));
redis.on("error", (err) => console.error("❌ Redis connection error:", err));
