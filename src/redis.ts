import Redis from "ioredis";
import config from "./app/config";

const isProduction = config.NODE_ENV === "production";

export const redis = new Redis({
    host: isProduction ? config.HOST_URL : "127.0.0.1",
    port: Number(config.REDIS_PORT) || 6379, // Fixed default port
    ...(config.REDIS_PASSWORD && { password: config.REDIS_PASSWORD }),

    // OPTIONAL: Retry strategy to see if it's failing repeatedly
    retryStrategy: (times) => {
        console.log(`Redis reconnecting... attempt ${times}`);
        return Math.min(times * 50, 2000);
    },
    // ADD THIS LINE:
    maxRetriesPerRequest: null,
});

redis.on("connect", () => console.log("✅ Redis connected successfully"));
redis.on("error", (err) => console.error("❌ Redis connection error:", err));