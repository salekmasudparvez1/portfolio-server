import { rateLimit } from "express-rate-limit"; // v7+
import RedisStore from "rate-limit-redis";
import { redis } from "../../redis"; // Your ioredis TCP connection
import handleRateLimitError from "../errors/RateLimitError";
import { Request, Response, NextFunction } from "express";

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 min
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 60, // Max requests
  standardHeaders: true, // Sends RateLimit-* headers
  legacyHeaders: false,  // Disable X-RateLimit-* headers

  store: new RedisStore({
    // ioredis instance
    // @ts-expect-error: rate-limit-redis types sometimes don't match ioredis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),

  handler: (req: Request, res: Response, next: NextFunction) => {
    const errorResponse = handleRateLimitError();
    res.status(errorResponse.statusCode).json({
      success: false,
      message: errorResponse.message,
      errorSources: errorResponse.errorSources,
    });
  },
});

export default limiter;
