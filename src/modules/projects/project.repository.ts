import { prisma } from "../../plugins/prisma.ts";

export const findProjectByUserIdAndName = async (
  name: string,
  userId: string,
) => {
  return prisma.project.findUnique({
    where: {
      name,
      userId,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
    },
  });
};

export const createUniqueProject = async (
  userId: string,
  name: string,
  apiKeySecretHash: string,
  description?: string,
) => {
  return prisma.project.create({
    data: {
      userId,
      name,
      apiKeySecretHash,
      description,
    },
  });
};
