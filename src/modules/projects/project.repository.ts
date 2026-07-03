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


