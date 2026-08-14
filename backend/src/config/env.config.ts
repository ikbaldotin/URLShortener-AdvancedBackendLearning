import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number(),
  FRONTEND_URL: z.string(),
  DATABASE_URL: z.string(),
  SALT_ROUNDS: z.coerce.number(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  SHORT_CODE_LENGTH: z.coerce.number(),
  REDIS_URL: z.string(),
  REDIS_PORT: z.coerce.number(),
  GLOBAL_RATE_LIMIT_WINDOW: z.coerce.number(),
  GLOBAL_RATE_LIMIT_SIZE: z.coerce.number(),
  LOGIN_RATE_LIMIT_WINDOW: z.coerce.number(),
  LOGIN_RATE_LIMIT_SIZE: z.coerce.number(),
  SHORT_URL_RATE_LIMIT_WINDOW: z.coerce.number(),
  SHORT_URL_RATE_LIMIT_SIZE: z.coerce.number(),
  SHORT_URL_TOKEN_BUCKET_CAPACITY: z.coerce.number(),
  SHORT_URL_TOKEN_BUCKET_REFILL_RATE: z.coerce.number(),
  SHORT_URL_TOKEN_BUCKET_REFILL_INTERVAL: z.coerce.number(),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables: ",
    z.treeifyError(parsedEnv.error),
  );
  process.exit(1);
}
export const env = parsedEnv.data;
