import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.url(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables");
  console.error(parsedEnv.error.format());

  process.exit(1);
}

export const ENV = {
  PORT: Number(parsedEnv.data.PORT),
  NODE_ENV: parsedEnv.data.NODE_ENV,
  DATABASE_URL: parsedEnv.data.DATABASE_URL,
};
