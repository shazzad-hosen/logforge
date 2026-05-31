import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(100, "Password is too long"),
});
