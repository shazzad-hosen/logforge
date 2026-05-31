import jwt from "jsonwebtoken";
import { ENV } from "../../../config/env.ts";
import { User } from "@prisma-client";
import crypto from "crypto";

export const generateAccessToken = (
  user: Omit<User, "passwordHash">,
): string => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    ENV.JWT_ACCESS_SECRET,
    {
      expiresIn: ENV.JWT_ACCESS_EXPIRY as any,
    },
  );
};

export const generateRefreshToken = (
  user: Omit<User, "passwordHash">,
): string => {
  return jwt.sign(
    {
      id: user.id,
      jti: crypto.randomBytes(16).toString("hex"),
    },
    ENV.JWT_REFRESH_SECRET,
    {
      expiresIn: ENV.JWT_REFRESH_EXPIRY as any,
    },
  );
};

export const generateTokenHash = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
