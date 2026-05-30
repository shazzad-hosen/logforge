import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.url(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRY: z.string(),
  JWT_REFRESH_EXPIRY: z.string(),
  COOKIE_SECRET: z.string(),
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
  JWT_ACCESS_SECRET: parsedEnv.data.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: parsedEnv.data.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: parsedEnv.data.JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY: parsedEnv.data.JWT_REFRESH_EXPIRY,
  COOKIE_SECRET: parsedEnv.data.COOKIE_SECRET,
};
