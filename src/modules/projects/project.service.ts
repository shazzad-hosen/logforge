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
