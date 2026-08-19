import { env } from "../../../config/env.config.js";
import { logger } from "../../../config/logger.js";
import redis from "../../../lib/redis.js";
import { AppError } from "../../../utils/common/Errors/App.Error.js";
import { IUrlRepository } from "../url.interface.js";
import { setCache } from "./cache.service.js";

export class CacheWarmerService {
  constructor(private readonly urlRepsitory: IUrlRepository) {}
  async warmHotUrl(limit: number): Promise<void> {
    logger.info({
      event: "CACHE_WARNING_STARTED",
      limit,
    });
    const hotUrls = await this.urlRepsitory.findTopUrl(limit);
    if (hotUrls.length === 0) {
      logger.info({
        evnet: "CACHE_WARNING_COMPELETED",
        warmedKeys: 0,
      });
      return;
    }
    const TTL = Number(env.HOT_URL_CACHE_TTL);
    const pipeline = redis.pipeline();
    for (const url of hotUrls) {
      pipeline.set(
        url.shortCode,
        JSON.stringify({
          shortUrlId: url.id,
          originalUrl: url.originalUrl,
        }),
        "EX",
        TTL,
      );
    }
    const result = await pipeline.exec();
    if (!result) {
      throw new AppError("Redis pipeline execution failed", 400);
    }
    await Promise.all(
      hotUrls.map((url) => setCache(url.shortCode, JSON.stringify(url), TTL)),
    );
    logger.info({
      event: "CACHE_WARMING_COMPELETED",
      warmedKeys: hotUrls.length,
      ttlSeconds: TTL,
    });
  }
}
