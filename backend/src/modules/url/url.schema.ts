import { z } from "zod";
export const urlSchema = z
  .object({
    originalUrl: z.url(),
  })
  .strict();

export type UrlDTO = z.infer<typeof urlSchema>;
