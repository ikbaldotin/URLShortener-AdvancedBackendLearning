import { ShortURL } from "../../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { measureQuery } from "../../utils/common/helper/MeasureQuery.js";
import { IUrlRepository } from "./url.interface.js";
import { createShortUrl, updateShortUrlType, UrlCursor } from "./url.types.js";

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
  async findShortUrlsByUserId(
    userId: string,
    limit: number = 10,
    cursor?: UrlCursor,
  ): Promise<ShortURL[] | null> {
    return measureQuery("findShortUrlsByUserId", () =>
      prisma.shortURL.findMany({
        where: {
          userId,
          ...(cursor && {
            OR: [
              {
                createdAt: {
                  lt: cursor.createdAt,
                },
              },
              {
                createdAt: cursor.createdAt,
                id: {
                  lt: cursor.id,
                },
              },
            ],
          }),
        },
        orderBy: [
          {
            createdAt: "desc",
          },
          {
            id: "desc",
          },
        ],
        take: limit + 1,
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
  async findShortUrlByIdandUserId(
    id: string,
    userId: string,
  ): Promise<ShortURL | null> {
    return measureQuery("findShortUrlByIdandUserId", () =>
      prisma.shortURL.findFirst({
        where: {
          id,
          userId,
        },
      }),
    );
  }

  async simulateLongQuery(): Promise<unknown> {
    console.log(`Starting query: ${new Date().toISOString()}`);

    const result = await prisma.$queryRaw`
        SELECT 'done'::text
        FROM pg_sleep(10)
      `;

    console.log(`Finished query: ${new Date().toISOString()}`);

    return result;
  }
}
