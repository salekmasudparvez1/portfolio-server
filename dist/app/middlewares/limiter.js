"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit"); // v7+
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const redis_1 = require("../../redis"); // Your ioredis TCP connection
const RateLimitError_1 = __importDefault(require("../errors/RateLimitError"));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 min
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 60, // Max requests
    standardHeaders: true, // Sends RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
    store: new rate_limit_redis_1.default({
        // ioredis instance
        // @ts-expect-error: rate-limit-redis types sometimes don't match ioredis
        sendCommand: (...args) => redis_1.redis.call(...args),
    }),
    handler: (req, res, next) => {
        const errorResponse = (0, RateLimitError_1.default)();
        res.status(errorResponse.statusCode).json({
            success: false,
            message: errorResponse.message,
            errorSources: errorResponse.errorSources,
        });
    },
});
exports.default = limiter;
//# sourceMappingURL=limiter.js.map