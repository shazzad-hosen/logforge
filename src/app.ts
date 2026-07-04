import Fastify from "fastify";
import errorHandler from "./middlewares/errorHandler.ts";
import { authRoutes } from "./modules/auth/auth.routes.ts";
import { projectRoutes } from "./modules/projects/project.routes.ts";
import fastifyCookie from "@fastify/cookie";
import { ENV } from "./config/env.ts";

export const app = Fastify({
  logger: true,
});

app.register(fastifyCookie, {
  secret: ENV.COOKIE_SECRET,
});

app.setErrorHandler(errorHandler);

app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    statusCode: 404,
    message: "Page not found",
  });
});

app.get("/", async () => {
  return {
    message: "Backend API is running successfully",
  };
});

app.register(authRoutes, {
  prefix: "/api/v1/auth",
});

app.register(projectRoutes, {
  prefix: "/api/v1/projects",
});
