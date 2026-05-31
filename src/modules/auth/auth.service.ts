import ApiError from "../../utils/ApiError.ts";
import { hashPassword, comparePassword } from "./utils/bcrypt.ts";
import { parseToMs } from "./utils/parseToMs.ts";
import { ENV } from "../../config/env.ts";

import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenHash,
} from "./utils/generateTokens.ts";

import {
  createUser,
  findUserByEmail,
  findUserByEmailForAuth,
} from "./repositories/auth.repository.ts";

import { createRefreshToken } from "./repositories/token.repository.ts";

export const registerUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser(email, passwordHash);

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const loginUser = async (
  email: string,
  password: string,
  userAgent: string,
  ipAddress: string,
) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await findUserByEmailForAuth(email);

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.passwordHash);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const tokenHash = generateTokenHash(refreshToken);

  const expiresAt = new Date(Date.now() + parseToMs(ENV.JWT_REFRESH_EXPIRY));

  await createRefreshToken(user.id, tokenHash, expiresAt, userAgent, ipAddress);

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    accessToken,
  };
};
