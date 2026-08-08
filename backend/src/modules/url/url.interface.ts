import { ShortURL } from "../../generated/prisma/index.js";
import { createShortUrl } from "./url.types.js";

export interface IUrlRepository {
  findByShortCode(shortCode: string): Promise<ShortURL | null>;
  createShortUrl(data: createShortUrl): Promise<ShortURL>;
}
