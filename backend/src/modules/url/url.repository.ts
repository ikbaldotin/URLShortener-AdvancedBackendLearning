import { ShortURL } from "../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { measureQuery } from "../../utils/common/helper/MeasureQuery.js";
import { IUrlRepository } from "./url.interface.js";
import { createShortUrl, updateShortUrlType } from "./url.types.js";

export class UrlRepository implements IUrlRepository {
  async findByShortCode(shortCode: string): Promise<ShortURL | null> {
    return measureQuery("findByShortCode", () =>
      prisma.shortURL.findUnique({
        where: {
          shortCode,
        },
      }),
    );
  }
  async createShortUrl(data: createShortUrl): Promise<ShortURL> {
    return measureQuery("createShortUrl", () =>
      prisma.shortURL.create({
        data,
      }),
    );
  }
  async updateShortUrl(
    shortCode: string,
    data: updateShortUrlType,
  ): Promise<ShortURL> {
    return measureQuery("updateShortUrl", () =>
      prisma.shortURL.update({
        where: {
          shortCode,
        },
        data: {
          originalUrl: data.updateOriginalUrl,
        },
      }),
    );
  }
  async findTopUrl(limit: number): Promise<ShortURL[]> {
    return measureQuery("findTopUrl", () =>
      prisma.shortURL.findMany({
        orderBy: { clickCount: "desc" },
        take: limit,
      }),
    );
  }
}
