import { ShortURL } from "../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { IUrlRepository } from "./url.interface.js";
import { createShortUrl } from "./url.types.js";

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
}
