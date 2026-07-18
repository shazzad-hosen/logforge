import { prisma } from "../../plugins/prisma.ts";

export const findProjectByUserIdAndName = async ({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) => {
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

export const findProjectsByUserId = async (userId: string) => {
  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.project.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    projects,
    total,
  };
};

export const findProjectByIdAndUserId = async ({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) => {
  return prisma.project.findUnique({
    where: {
      userId,
      id: projectId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
