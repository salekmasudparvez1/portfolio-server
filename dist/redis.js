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
    host: isProduction ? config_1.default.HOST_URL : "127.0.0.1",
    port: Number(config_1.default.REDIS_PORT) || 6379, // Fixed default port
    ...(config_1.default.REDIS_PASSWORD && { password: config_1.default.REDIS_PASSWORD }),
    // OPTIONAL: Retry strategy to see if it's failing repeatedly
    retryStrategy: (times) => {
        console.log(`Redis reconnecting... attempt ${times}`);
        return Math.min(times * 50, 2000);
    },
    // ADD THIS LINE:
    maxRetriesPerRequest: null,
});
exports.redis.on("connect", () => console.log("✅ Redis connected successfully"));
exports.redis.on("error", (err) => console.error("❌ Redis connection error:", err));
//# sourceMappingURL=redis.js.map