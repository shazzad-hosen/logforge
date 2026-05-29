import { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import { ENV } from "../config/env.ts";

const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  reply.status(statusCode).send({
    success: false,
    statusCode,
    message,
    ...(ENV.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export default errorHandler;
