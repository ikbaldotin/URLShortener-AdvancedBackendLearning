import { logger } from "../../config/logger.js";
import { AppError } from "../../utils/common/Errors/App.Error.js";
import bloomService from "../bloom/bloom.container.js";
import { LockService } from "../lock/lock.service.js";
import { getCache, setCache } from "./cache/cache.service.js";
import {
  createShortCode,
  decodedCursor,
  encodeCursor,
  getShortUrlCacheKey,
  parseUrl,
} from "./url.helper.js";
import { IUrlRepository } from "./url.interface.js";
import { updateUrlDTO, UrlDTO } from "./url.schema.js";
import { UrlCursor } from "./url.types.js";

export class UrlService {
  constructor(
    private urlRepo: IUrlRepository,
    private lockRep: LockService,
  ) {}
  async createShortUrl(data: UrlDTO, userId: string) {
    const originalUrl = data.originalUrl;
    const parseOriginalUrl = parseUrl(originalUrl);
    const MAX_RETIRES = 6;
    for (let i = 0; i < MAX_RETIRES; i++) {
      const shortCode = createShortCode();
      const exitingShortUrl = await this.urlRepo.findByShortCode(shortCode);
      if (exitingShortUrl) {
        continue;
      }
      const shortUrl = await this.urlRepo.createShortUrl({
        originalUrl: parseOriginalUrl,
        userId,
        shortCode,
      });
      try {
        await bloomService.add(shortCode);
        logger.info({
          event: "BLO0M_FILTER_UPDATED",
          shortCode,
        });
      } catch (error) {
        logger.warn({
          event: "BLOOM_FILTER_UPDATE_FAILED",
          shortCode,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
      return shortUrl;
    }
    throw new AppError("short url is already exists", 400);
  }
  async getOriginalUrlFromShortCode(shortCode: string) {
    const mightExist = await bloomService.mightExist(shortCode);
    if (!mightExist) {
      logger.info({
        event: "BLOOM_FILTER_NEGATIVE",
        shortCode,
      });
      throw new AppError("Short url not found", 404);
    }
    logger.info({
      event: "BLOOM_FILTER_POSITIVE",
      shortCode,
    });
    const cachedShortUrl = await getCache(getShortUrlCacheKey(shortCode));

    if (cachedShortUrl) {
      const parsedCachedShortUrl = JSON.parse(cachedShortUrl);
      logger.info({
        event: "CACHE_HIT",
        shortCode,
      });
      return parsedCachedShortUrl;
    }
    logger.info({
      event: "CACHE_MISS",
      shortCode,
    });
    const lock = await this.lockRep.aquireLock(shortCode);
    if (!lock.acquired) {
      logger.info({
        event: "CACHE_REBUILD_IN_PROGRESS",
        shortCode,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
      const cacheAgain = await getCache(getShortUrlCacheKey(shortCode));
      if (cacheAgain) {
        const parsedCachedAgain = JSON.parse(cacheAgain);
        logger.info({
          event: "CACHE_HIT_AFTER_WAIT",
          shortCode,
        });
        return parsedCachedAgain;
      }
      logger.warn({
        event: "CACHE_REBUILD_TIMEOUT",
        shortCode,
      });
      throw new AppError("Please retry shortly", 503);
    }
    try {
      const shortUrl = await this.urlRepo.findByShortCode(shortCode);

      if (!shortUrl) {
        throw new AppError("short url is not found", 404);
      }
      const response = {
        shortUrlId: shortUrl.id,
        originalUrl: shortUrl.originalUrl,
      };
      await setCache(
        getShortUrlCacheKey(shortUrl.shortCode),
        JSON.stringify({
          response,
        }),
        300,
      );
      return response;
    } finally {
      if (lock.lockId) {
        await this.lockRep.releaseLock(shortCode, lock.lockId);
      }
    }
  }
  async getUserUrls(userId: string, limit: number, cursor?: string) {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const decodeCursor = cursor ? decodedCursor(cursor) : undefined;
    console.log({ decodeCursor });
    const urls = await this.urlRepo.findShortUrlsByUserId(
      userId,
      safeLimit,
      decodeCursor,
    );
    if (!urls) {
      throw new AppError("Urls is not found", 404);
    }
    const hasMore = urls.length > safeLimit;
    const items = hasMore ? urls.slice(0, safeLimit) : urls;
    const nextCursor = hasMore
      ? encodeCursor({
          createdAt: items[items.length - 1].createdAt,
          id: items[items.length - 1].id,
        })
      : null;
    return {
      items,
      nextCursor,
      hasMore,
    };
  }
  async updateOriginalUrl(
    userId: string,
    shortCode: string,
    data: updateUrlDTO,
  ) {
    const shortUrl = await this.urlRepo.findByShortCode(shortCode);
    const parsedUpdateUrl = parseUrl(data.updateOriginalUrl);
    if (!shortUrl) {
      throw new AppError("short url is not found", 404);
    }
    if (shortUrl?.userId !== userId) {
      throw new AppError("You not allowed perform this action", 401);
    }
    const updateShortUrl = await this.urlRepo.updateShortUrl(shortCode, {
      updateOriginalUrl: parsedUpdateUrl,
    });
    if (!updateShortUrl) {
      throw new AppError("You not allowed perform this action", 401);
    }
    await setCache(
      getShortUrlCacheKey(updateShortUrl.shortCode),

      JSON.stringify({
        shortUrlId: updateShortUrl.id,
        originalUrl: updateShortUrl.originalUrl,
      }),
      300,
    );
    return updateShortUrl;
  }
  async simulateLongQuery() {
    return this.urlRepo.simulateLongQuery();
  }
}
