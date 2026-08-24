import { customAlphabet } from "nanoid";
import { env } from "../../config/env.config.js";
import { AppError } from "../../utils/common/Errors/App.Error.js";
import { UrlCursor } from "./url.types.js";
const SHORTCODELENGTH = env.SHORT_CODE_LENGTH || 8;
const ALLOWEDPROTOCOLS = ["http:", "https:"];
const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const createId = customAlphabet(CHARACTERS, SHORTCODELENGTH);
export const createShortCode = (): string => {
  return createId();
};
export const getShortUrlCacheKey = (shortCode: string) => {
  return `shortCode:${shortCode}`;
};
export const parseUrl = (originalUrl: string): string => {
  try {
    const parseUrl = new URL(originalUrl);
    if (!parseUrl) {
      throw new AppError("Invalid URL", 400);
    }
    if (!ALLOWEDPROTOCOLS.includes(parseUrl.protocol)) {
      throw new AppError("Only http and https URLS", 400);
    }
    return parseUrl.toString();
  } catch (error) {
    throw new AppError("Invalid Url", 400);
  }
};
export const encodeCursor = (cursor: UrlCursor): string => {
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
};
export const decodedCursor = (cursor: string): UrlCursor => {
  const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  return {
    createdAt: new Date(decoded.createdAt),
    id: decoded.id,
  };
};
