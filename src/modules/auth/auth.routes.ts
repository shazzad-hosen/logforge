import { FastifyInstance } from "fastify";
import { registerUserController } from "./auth.controller.ts";

export const authRoutes = async (app: FastifyInstance) => {
  app.post("/register", registerUserController);
};
