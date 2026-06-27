import { FastifyInstance } from "fastify";
import authenticateRefreshSession from "./middlewares/authenticateRefreshSession.middleware.ts";
import authenticateAccessToken from "./middlewares/authenticateAccessToken.middleware.ts";

import {
  registerUserController,
  loginUserController,
  refreshUserTokenController,
  logoutUserController,
  getUserDataController,
} from "./auth.controller.ts";

export const authRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/register",
    handler: registerUserController,
  });

  app.route({
    method: "POST",
    url: "/login",
    handler: loginUserController,
  });

  app.route({
    method: "POST",
    url: "/refresh",
    preHandler: authenticateRefreshSession,
    handler: refreshUserTokenController,
  });

  app.route({
    method: "POST",
    url: "/logout",
    handler: logoutUserController,
  });

  app.route({
    method: "GET",
    url: "/me",
    preHandler: authenticateAccessToken,
    handler: getUserDataController,
  });
};
