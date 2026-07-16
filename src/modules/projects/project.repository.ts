import { prisma } from "../../plugins/prisma.ts";

export const findProjectByUserIdAndName = async (
  name: string,
  userId: string,
) => {
  return prisma.project.findUnique({
    where: {
      userId_name: {
        userId,
        name,
      },
    },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
    },
  });
};

type CreateProjectInput = {
  userId: string;
  name: string;
  apiKeySecretHash: string;
  description?: string;
};

export const createUniqueProject = async (input: CreateProjectInput) => {
  return prisma.project.create({
    data: input,
    select: {
      id: true,
      name: true,
      description: true,
      userId: true,
      createdAt: true,
    },
  });
};
