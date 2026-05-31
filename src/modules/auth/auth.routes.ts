import { FastifyInstance } from "fastify";

import {
  registerUserController,
  loginUserController,
} from "./auth.controller.ts";

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/register", registerUserController);

  app.post("/login", loginUserController);
};
