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
      isRevoked: true,
      tokenHash: true,
      expiresAt: true,
    },
  });
};
