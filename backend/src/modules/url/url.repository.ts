import { ShortURL } from "../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { IUrlRepository } from "./url.interface.js";
import { createShortUrl, updateShortUrlType } from "./url.types.js";

export class UrlRepository implements IUrlRepository {
  async findByShortCode(shortCode: string): Promise<ShortURL | null> {
    const shortUrl = await prisma.shortURL.findUnique({
      where: { shortCode },
    });
    return shortUrl;
  }
  async createShortUrl(data: createShortUrl): Promise<ShortURL> {
    const shortUrl = await prisma.shortURL.create({
      data,
    });
    return shortUrl;
  }
  async updateShortUrl(
    userId: string,
    shortCode: string,
    data: updateShortUrlType,
  ): Promise<ShortURL> {
    const updateUrl = await prisma.shortURL.update({
      where: {
        shortCode,
        userId,
      },
      data: {
        originalUrl: data.updateOriginalUrl,
      },
    });
    return updateUrl;
  }
}
