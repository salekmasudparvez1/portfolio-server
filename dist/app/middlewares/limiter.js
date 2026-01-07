"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit"); // Named import for v7+
const rate_limit_redis_1 = __importDefault(require("rate-limit-redis"));
const redis_1 = require("../../redis");
const RateLimitError_1 = __importDefault(require("../errors/RateLimitError"));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: "draft-7", // Recommended: sends RateLimit-* headers
    legacyHeaders: false, // Recommended: disables X-RateLimit-* headers
    store: new rate_limit_redis_1.default({
        // @ts-expect-error - Known mismatch between ioredis types and rate-limit-redis
        sendCommand: (...args) => redis_1.redis.call(...args),
    }),
    handler: (req, res, next) => {
        const errorResponse = (0, RateLimitError_1.default)();
        res.status(errorResponse.statusCode).json({
            success: false,
            message: errorResponse?.message,
            errorSources: errorResponse?.errorSources,
        });
    }
});
exports.default = limiter;
//# sourceMappingURL=limiter.js.map