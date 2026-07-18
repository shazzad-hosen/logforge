import ApiError from "../../utils/ApiError.ts";
import { generateApiKey, generateApiKeyHash } from "./utils/apiKey.ts";

import {
  findProjectByUserIdAndName,
  createUniqueProject,
  findProjectsByUserId,
  findProjectByIdAndUserId,
} from "./project.repository.ts";

export const createProject = async (
  userId: string,
  name: string,
  description?: string,
) => {
  if (!name || !userId) {
    throw new ApiError(400, "All fields are required");
  }

  const existingProject = await findProjectByUserIdAndName({ name, userId });

  if (existingProject) {
    throw new ApiError(409, "You already have a project with this name");
  }

  const apiKey = generateApiKey();

  const apiKeySecretHash = generateApiKeyHash(apiKey);

  const data = await createUniqueProject({
    userId,
    name,
    apiKeySecretHash,
    description,
  });

  return {
    project: {
      data,
      apiKey,
    },
  };
};

export const getProjects = async (userId: string) => {
  const data = await findProjectsByUserId(userId);

  return {
    total: data.total,
    projects: data.projects,
  };
};

export const getDistinctProject = async (userId: string, projectId: string) => {
  const project = await findProjectByIdAndUserId({ userId, projectId });

  if (!project) {
    throw new ApiError(404, "Project doesn't exist");
  }

  return {
    project,
  };
};
