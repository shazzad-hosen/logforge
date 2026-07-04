import ApiError from "../../utils/ApiError.ts";
import { generateApiKey, generateApiKeyHash } from "./utils/apiKey.ts";

import {
  findProjectByUserIdAndName,
  createUniqueProject,
} from "./project.repository.ts";

export const createProject = async (
  userId: string,
  name: string,
  description?: string,
) => {
  if (!userId || !name) {
    throw new ApiError(400, "All fields are required");
  }

  const existingProject = await findProjectByUserIdAndName(userId, name);

  if (existingProject) {
    throw new ApiError(409, "Duplicate project names are not allowed");
  }

  const apiKey = generateApiKey();

  const apiKeySecretHash = generateApiKeyHash(apiKey);

  const project = await createUniqueProject(
    userId,
    name,
    apiKeySecretHash,
    description,
  );

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    userId: project.userId,
    createdAt: project.createdAt,
    apiKey,
  };
};
