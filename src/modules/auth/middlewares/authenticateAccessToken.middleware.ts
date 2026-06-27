import { FastifyRequest, FastifyReply } from "fastify";
import ApiError from "../../../utils/ApiError.ts";
import { decodeAccessToken } from "../utils/generateTokens.ts";
import { findUserById } from "../repositories/auth.repository.ts";

declare module "fastify" {
  interface FastifyRequest {
    user?: object;
  }
}

const authenticateAccessToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authHeader = request.headers?.authorization as string;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, invalid token format");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Not authorized, token missing");
  }

  try {
    const decoded = decodeAccessToken(token);

    const user = await findUserById(decoded.sub);

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    request.user = user;
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

export default authenticateAccessToken;
