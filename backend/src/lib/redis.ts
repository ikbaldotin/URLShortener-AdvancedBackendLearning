import { Redis } from "ioredis";
import { env } from "../config/env.config.js";
import { logger } from "../config/logger.js";
import bloomService from "../modules/bloom/bloom.container.js";
export const redisConnection = {
  host: env.REDIS_URL,
  port: Number(env.REDIS_PORT),
  maxRetriesPerRequest: null,
};
const redis = new Redis(redisConnection);

redis.on("connect", () => {
  logger.info("Redis connected successfully");
});
redis.on("ready", async () => {
  await bloomService.initialize();
  logger.info("Redis is ready");
});
redis.on("error", (error) => {
  logger.error(`Redis fail to connected:${error}`);
});

export default redis;
