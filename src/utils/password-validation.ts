import { z } from "zod";

export const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((v) => [...v].some((c) => c >= "a" && c <= "z"), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((v) => [...v].some((c) => c >= "A" && c <= "Z"), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((v) => [...v].some((c) => c >= "0" && c <= "9"), {
    message: "Password must contain at least one number",
  })
  .refine((v) => [...v].some((c) => !/[a-zA-Z0-9]/.test(c)), {
    message: "Password must contain at least one special character",
  });
