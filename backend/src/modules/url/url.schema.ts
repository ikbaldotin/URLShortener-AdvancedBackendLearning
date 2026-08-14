import { z } from "zod";
export const createUrlSchema = z
  .object({
    originalUrl: z.string().trim().min(1, "Url is required").url("Invalid url"),
  })
  .strict();
export const updateUrlSchema = z.object({
  updateOriginalUrl: z.url(),
});
export type UrlDTO = z.infer<typeof createUrlSchema>;
export type updateUrlDTO = z.infer<typeof updateUrlSchema>;
