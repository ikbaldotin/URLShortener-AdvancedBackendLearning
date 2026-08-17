import { ShortURL } from "../../generated/prisma/index.js";
import { createShortUrl, updateShortUrlType } from "./url.types.js";

export interface IUrlRepository {
  findByShortCode(shortCode: string): Promise<ShortURL | null>;
  createShortUrl(data: createShortUrl): Promise<ShortURL>;
  updateShortUrl(
    shortCode: string,
    data: updateShortUrlType,
  ): Promise<ShortURL>;
}
