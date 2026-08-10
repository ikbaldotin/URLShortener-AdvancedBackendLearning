import { customAlphabet } from "nanoid";
import { env } from "../../config/env.config.js";
const SHORTCODELENGTH = env.SHORT_CODE_LENGTH || 8;
const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const createId = customAlphabet(CHARACTERS, SHORTCODELENGTH);
export const createShortCode = (): string => {
  return createId();
};
export const getShortUrlCacheKey = (shortCode: string) => {
  return `shortCode:${shortCode}`;
};
