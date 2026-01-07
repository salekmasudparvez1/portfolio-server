import { rateLimit } from "express-rate-limit"; // Named import for v7+
import RedisStore from "rate-limit-redis";
import { redis } from "../../redis";
import handleRateLimitError from "../errors/RateLimitError";
import { NextFunction, Request, Response } from "express";

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  limit: 60, 
  standardHeaders: "draft-7", // Recommended: sends RateLimit-* headers
  legacyHeaders: false, // Recommended: disables X-RateLimit-* headers
  store: new RedisStore({
    // @ts-expect-error - Known mismatch between ioredis types and rate-limit-redis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  handler : (req:Request, res:Response, next:NextFunction) =>{
    const errorResponse = handleRateLimitError()
    res.status(errorResponse.statusCode).json({
      success: false,
      message: errorResponse?.message,
      errorSources: errorResponse?.errorSources,
    });
  }
});

export default limiter;
