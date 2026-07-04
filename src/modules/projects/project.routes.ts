import { FastifyInstance } from "fastify";
import { createProjectController } from "./project.controller.ts";
import authenticateAccessToken from "../auth/middlewares/authenticateAccessToken.middleware.ts";

export const projectRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/",
    preHandler: authenticateAccessToken,
    handler: createProjectController,
  });
};
