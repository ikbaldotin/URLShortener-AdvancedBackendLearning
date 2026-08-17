import { logger } from "../../config/logger.js";
import { AppError } from "../../utils/common/Errors/App.Error.js";
import { deleteCache, getCache, setCache } from "./cache/cache.service.js";
import {
  createShortCode,
  getShortUrlCacheKey,
  parseUrl,
} from "./url.helper.js";
import { IUrlRepository } from "./url.interface.js";
import { updateUrlDTO, UrlDTO } from "./url.schema.js";

export class UrlService {
  constructor(private urlRepo: IUrlRepository) {}
  async createShortUrl(data: UrlDTO, userId: string) {
    const originalUrl = data.originalUrl;
    const parseOriginalUrl = parseUrl(originalUrl);
    const MAX_RETIRES = 6;
    for (let i = 0; i < MAX_RETIRES; i++) {
      const shortCode = createShortCode();
      const exitingShortUrl = await this.urlRepo.findByShortCode(shortCode);
      if (!exitingShortUrl) {
        const shortUrl = await this.urlRepo.createShortUrl({
          originalUrl: parseOriginalUrl,
          userId,
          shortCode,
        });
        await setCache(
          getShortUrlCacheKey(shortUrl.shortCode),
          JSON.stringify(shortUrl),
          300,
        );
        return shortUrl;
      }
    }
    throw new AppError("short url is already exists", 400);
  }
  async getOriginalUrlFromShortCode(shortCode: string) {
    const cachedShortUrl = await getCache(`shortCode:${shortCode}`);

    if (cachedShortUrl) {
      const parsedCachedShortUrl = JSON.parse(cachedShortUrl);
      logger.info({
        event: "CACHE_HIT",
        shortCode,
      });
      return parsedCachedShortUrl;
    }
    const shortUrl = await this.urlRepo.findByShortCode(shortCode);

    if (!shortUrl) {
      throw new AppError("short url is not found", 404);
    }
    await setCache(
      getShortUrlCacheKey(shortUrl.shortCode),
      JSON.stringify(shortUrl),
      300,
    );
    return shortUrl;
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
      JSON.stringify(updateShortUrl),
      300,
    );
    return updateShortUrl;
  }
}
