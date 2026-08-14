import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.config.js";
import { AppError } from "../../utils/common/Errors/App.Error.js";
import redis from "../../lib/redis.js";
import { TokenBucket } from "./type.js";

const CAPACITY = Number(env.SHORT_URL_TOKEN_BUCKET_CAPACITY);
const REFIL_RATE = Number(env.SHORT_URL_TOKEN_BUCKET_REFILL_RATE);
const REFILL_INTERVAL = Number(env.SHORT_URL_TOKEN_BUCKET_REFILL_INTERVAL);
const TTL = 3600;

export const shortUrlTokenBucketRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId as string;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }
    const key = `token-bucket:${userId}`;
    const cachedBucket = await redis.get(key);
    let bucket: TokenBucket;
    if (!cachedBucket) {
      bucket = {
        tokens: CAPACITY,
        lastRefill: Date.now(),
      };
    } else {
      bucket = JSON.parse(cachedBucket);
      const now = Date.now();
      const elapsed = now - bucket.lastRefill;
      const refillCount = Math.floor(elapsed / REFILL_INTERVAL);
      if (refillCount > 0) {
        bucket.tokens = Math.min(
          CAPACITY,
          bucket.tokens + refillCount * REFIL_RATE,
        );
        bucket.lastRefill += refillCount * REFILL_INTERVAL;
      }
      if (bucket.tokens <= 0) {
        return res.status(429).json({
          success: false,
          message: "Too many request.Please try again later",
        });
      }
      bucket.tokens--;
      await redis.set(key, JSON.stringify(bucket), "EX", TTL);
      next();
    }
  } catch (error) {
    next(error);
  }
};
