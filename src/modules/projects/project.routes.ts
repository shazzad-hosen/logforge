import { FastifyInstance } from "fastify";
import authenticateAccessToken from "../auth/middlewares/authenticateAccessToken.middleware.ts";

import {
  createProjectController,
  getProjectsController,
  getDistinctProjectController,
  deleteProjectController,
  regenerateProjectApiKeyController,
} from "./project.controller.ts";

export const projectRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/",
    preHandler: authenticateAccessToken,
    handler: createProjectController,
  });

  app.route({
    method: "GET",
    url: "/",
    preHandler: authenticateAccessToken,
    handler: getProjectsController,
  });

  app.route({
    method: "POST",
    url: "/:projectId",
    preHandler: authenticateAccessToken,
    handler: getDistinctProjectController,
  });

  app.route({
    method: "DELETE",
    url: "/:projectId",
    preHandler: authenticateAccessToken,
    handler: deleteProjectController,
  });

  app.route({
    method: "POST",
    url: "/:projectId/regenerate-api-key",
    preHandler: authenticateAccessToken,
    handler: regenerateProjectApiKeyController,
  });
};
