import { FastifyRequest, FastifyReply } from "fastify";
import ApiError from "../../../utils/ApiError.ts";
import { findRefreshTokenByHash } from "../repositories/token.repository.ts";

import {
  generateTokenHash,
  decodeRefreshToken,
} from "../utils/generateTokens.ts";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    refreshToken?: string;
  }
}

const authenticateRefreshSession = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const token = request.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  try {
    const decoded = decodeRefreshToken(token);

    const hashedToken = generateTokenHash(token);
    const existingToken = await findRefreshTokenByHash(hashedToken);

    if (!existingToken) {
      throw new ApiError(403, "Invalid session. Please login again.");
    }

    if (new Date(existingToken.expiresAt) < new Date()) {
      throw new ApiError(401, "Refresh token expired");
    }

    if (existingToken.isRevoked) {
      throw new ApiError(401, "Refresh token revoked");
    }

    request.userId = decoded.id;
    request.refreshToken = existingToken.tokenHash;
  } catch (error) {
    throw new ApiError(401, "Session invalid or expired");
  }
};

export default authenticateRefreshSession;
