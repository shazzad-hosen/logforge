import { prisma } from "../../../plugins/prisma.ts";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const findUserByEmailForAuth = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (email: string, passwordHash: string) => {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
};
