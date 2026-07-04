import { ENV } from "../../config/env.ts";
import { parseToMs } from "./utils/parseToMs.ts";
import { FastifyRequest, FastifyReply } from "fastify";
import { registerSchema, loginSchema } from "./auth.schema.ts";

import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  getUserData,
} from "./auth.service.ts";

export const registerUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const parsedData = registerSchema.safeParse(request.body);

  if (!parsedData.success) {
    const errors = Object.fromEntries(
      parsedData.error.issues.map((i) => [i.path[0], i.message]),
    );

    return reply.status(400).send({ errors });
  }

  const { email, password } = parsedData.data;

  const user = await registerUser(email, password);

  return reply.status(201).send({
    success: true,
    message: "User created successfully",
    user,
  });
};

export const loginUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const parsedData = loginSchema.safeParse(request.body);

  if (!parsedData.success) {
    const errors = Object.fromEntries(
      parsedData.error.issues.map((i) => [i.path[0], i.message]),
    );

    return reply.status(400).send({ errors });
  }

  const userAgent = request.headers["user-agent"] || "unknown";
  const ipAddress = request.ip;

  const response = await loginUser(parsedData.data, userAgent, ipAddress);

  reply.setCookie("refreshToken", response.refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: parseToMs(ENV.JWT_REFRESH_EXPIRY) / 1000,
  });

  return reply.status(200).send({
    success: true,
    message: "Login successful",
    data: {
      user: response.user,
      accessToken: response.accessToken,
    },
  });
};

export const refreshUserTokenController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userAgent = request.headers["user-agent"] || "unknown";
  const ipAddress = request.ip;
  const rawRefreshToken = request.cookies.refreshToken || "unknown";

  const response = await refreshUserToken(
    rawRefreshToken,
    userAgent,
    ipAddress,
  );

  reply.setCookie("refreshToken", response.refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: parseToMs(ENV.JWT_REFRESH_EXPIRY) / 1000,
  });

  return reply.status(200).send({
    seccess: true,
    accessToken: response.accessToken,
  });
};

export const logoutUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const rawRefreshToken = request.cookies.refreshToken || "unknown";

  const response = await logoutUser(rawRefreshToken);

  reply.clearCookie("refreshToken", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return reply.status(200).send({
    success: true,
    ...response,
  });
};

interface AuthenticatedUser {
  id: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
}

export const getUserDataController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = await getUserData(request.user as AuthenticatedUser);

  return reply.status(200).send({
    success: true,
    data,
  });
};
