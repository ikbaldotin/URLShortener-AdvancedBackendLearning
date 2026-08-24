import { ShortURL } from "../../generated/prisma/index.js";
import { createShortUrl, updateShortUrlType, UrlCursor } from "./url.types.js";

export interface IUrlRepository {
  findByShortCode(shortCode: string): Promise<ShortURL | null>;
  findShortUrlsByUserId(
    userId: string,
    limit: number,
    cursor?: UrlCursor,
  ): Promise<ShortURL[] | null>;
  createShortUrl(data: createShortUrl): Promise<ShortURL>;
  findShortUrlByIdandUserId(
    id: string,
    userId: string,
  ): Promise<ShortURL | null>;
  updateShortUrl(
    shortCode: string,
    data: updateShortUrlType,
  ): Promise<ShortURL>;
  findTopUrl(limit: number): Promise<ShortURL[]>;
}
