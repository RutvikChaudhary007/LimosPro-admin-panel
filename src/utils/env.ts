//@ts-nocheck
import { z } from "zod";

const envSchema = z.object({
  VITE_GOOGLE_MAP_KEY: z.string(),
  VITE_API_USER_SERVICE_URL: z.url(),
  VITE_API_ADMIN_SERVICE_URL: z.url(),
  VITE_API_BOOKING_SERVICE_URL: z.url(),
});

let parsedEnv: z.infer<typeof envSchema> | null = null;
let envError: string | null = null;

try {
  parsedEnv = envSchema.parse(import.meta.env);
} catch (err) {
  if (err instanceof z.ZodError) {
    // console.error("err:",JSON.parse(err.message)?.map(e => `${e.path.join(".")}: ${e.message}`)?.join("\n"))
    // console.error("err:",err.message?.map(e => `${e.path.join(".")}: ${e.message}`)?.join("\n"))
    envError = JSON.parse(err.message)
      ?.map((e) => `${e.path.join(".")}: ${e.message}`)
      ?.join("\n");
  } else {
    envError = "Unknown environment validation error.";
  }
}

export const env = parsedEnv;
export const envValidationError = envError;
