import { dmmfToRuntimeDataModel } from "@prisma/client/runtime/client";
import { prisma } from "../../../plugins/prisma.ts";

export const createRefreshToken = async (
  userId: string,
  tokenHash: string,
  expiresAt: Date,
  userAgent?: string,
  ipAddress?: string,
) => {
  return prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      userAgent,
      ipAddress,
    },
  });
};

export const findRefreshTokenByHash = async (tokenHash: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    select: {
      id: true,
      userId: true,
      tokenHash: true,
      isRevoked: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  });
};

export const revokeSessionByTokenHash = async (tokenHash: string) => {
  return prisma.refreshToken.update({
    where: {
      tokenHash,
    },
    data: {
      isRevoked: true,
    },
  });
};
