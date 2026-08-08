import { AppError } from "../../utils/common/Errors/App.Error.js";
import { createShortCode } from "./url.helper.js";
import { IUrlRepository } from "./url.interface.js";
import { UrlDTO } from "./url.schema.js";

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
        return shortUrl;
      }
    }
    throw new AppError("short url is already exists", 400);
  }
  async getOriginalUrlFromShortCode(shortCode: string) {
    const shortUrl = await this.urlRepo.findByShortCode(shortCode);
    if (!shortUrl) {
      throw new AppError("short url is not found", 404);
    }
    return shortUrl.originalUrl;
  }
}
