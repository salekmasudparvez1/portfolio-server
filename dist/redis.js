"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("./app/config"));
const isProduction = config_1.default.NODE_ENV === "production";
exports.redis = new ioredis_1.default({
    host: isProduction ? config_1.default.REDIS_HOST_URL : "127.0.0.1",
    port: Number(config_1.default.REDIS_PORT) || 6379,
    ...(config_1.default.REDIS_PASSWORD && { password: config_1.default.REDIS_PASSWORD }),
    ...(isProduction && config_1.default.REDIS_TLS === "true" ? { tls: {} } : {}),
    maxRetriesPerRequest: null, // Prevent crashes if Redis temporarily unavailable
    retryStrategy: (times) => {
        console.log(`Redis reconnecting... attempt ${times}`);
        return Math.min(times * 50, 2000);
    },
});
exports.redis.on("connect", () => console.log("✅ Redis connected successfully"));
exports.redis.on("error", (err) => console.error("❌ Redis connection error:", err));
//# sourceMappingURL=redis.js.map