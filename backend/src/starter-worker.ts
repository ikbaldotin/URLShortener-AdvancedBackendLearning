import "dotenv/config";
import "./workers/analyticsWorker.js";
import "./workers/cacheWarmWorker.js";
import { logger } from "./config/logger.js";
import { cacheWarmerQueue } from "./queues/cacheWarmerQueue.js";
import { env } from "./config/env.config.js";
logger.info("Workers started");
await cacheWarmerQueue.upsertJobScheduler(
  "cache-warmer",
  {
    every: Number(env.CACHE_WARMER_TIME) * 1000,
  },
  {
    name: "warm chache",
  },
);
logger.info({
  event: "CACHE_WARMER_SCHEDULER_STARTED",
});
