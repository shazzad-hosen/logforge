import Fastify from "fastify";
import errorHandler from "./middlewares/errorHandler.ts";
import { authRoutes } from "./modules/auth/auth.routes.ts";
import fastifyCookie from "@fastify/cookie";
import { ENV } from "./config/env.ts";

export const app = Fastify({
  logger: true,
});

app.register(fastifyCookie, {
  secret: ENV.COOKIE_SECRET,
});

app.setErrorHandler(errorHandler);

app.get("/", async () => {
  return {
    message: "API is running successfully",
  };
});

app.register(authRoutes, {
  prefix: "/api/auth",
});
