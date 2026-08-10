import { logger } from "../../config/logger.js";
import { AppError } from "../../utils/common/Errors/App.Error.js";
import { deleteCache, getCache, setCache } from "./cache/cache.service.js";
import { createShortCode, getShortUrlCacheKey } from "./url.helper.js";
import { IUrlRepository } from "./url.interface.js";
import { updateUrlDTO, UrlDTO } from "./url.schema.js";

export class UrlService {
  constructor(private urlRepo: IUrlRepository) {}
  async createShortUrl(data: UrlDTO, userId: string) {
    const originalUrl = data.originalUrl;

    const MAX_RETIRES = 6;
    for (let i = 0; i < MAX_RETIRES; i++) {
      const shortCode = createShortCode();
      const exitingShortUrl = await this.urlRepo.findByShortCode(shortCode);
      if (!exitingShortUrl) {
        const shortUrl = await this.urlRepo.createShortUrl({
          originalUrl,
          userId,
          shortCode,
        });
        await setCache(
          getShortUrlCacheKey(shortUrl.shortCode),
          `${shortUrl.originalUrl}`,
          300,
        );
        return shortUrl;
      }
    }
    throw new AppError("short url is already exists", 400);
  }
  async getOriginalUrlFromShortCode(shortCode: string) {
    const cachedOriginalUrl = await getCache(`shortCode:${shortCode}`);
    if (cachedOriginalUrl) {
      logger.info({
        event: "CACHE_HIT",
        shortCode,
      });
      return cachedOriginalUrl;
    }
    const shortUrl = await this.urlRepo.findByShortCode(shortCode);

    if (!shortUrl) {
      throw new AppError("short url is not found", 404);
    }
    await setCache(
      getShortUrlCacheKey(shortUrl.shortCode),
      `${shortUrl.originalUrl}`,
      300,
    );
    return shortUrl.originalUrl;
  }
  async updateOriginalUrl(
    userId: string,
    shortCode: string,
    data: updateUrlDTO,
  ) {
    const shortUrl = await this.urlRepo.findByShortCode(shortCode);
    if (!shortUrl) {
      throw new AppError("short url is not found", 404);
    }
    if (shortUrl?.userId !== userId) {
      throw new AppError("You not allowed perform this action", 401);
    }
    const updateShortUrl = await this.urlRepo.updateShortUrl(
      userId,
      shortCode,
      data,
    );
    if (!updateShortUrl) {
      throw new AppError("You not allowed perform this action", 401);
    }
    await deleteCache(getShortUrlCacheKey(updateShortUrl.shortCode));
    return updateShortUrl;
  }
}
