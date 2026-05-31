import { ENV } from "../../config/env.ts";
import { parseToMs } from "./utils/parseToMs.ts";
import { FastifyRequest, FastifyReply } from "fastify";
import { registerSchema, loginSchema } from "./auth.schema.ts";
import { registerUser, loginUser } from "./auth.service.ts";

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
  const result = await loginUser(parsedData.data, userAgent);

  reply.setCookie("refreshToken", result.refreshToken, {
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
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};
