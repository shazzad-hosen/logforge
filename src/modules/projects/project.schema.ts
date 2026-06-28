import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Project name should be at least 5 characters long")
    .max(25, "Project name is too long")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Project name contains invalid characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional()
    .default(""),
});
