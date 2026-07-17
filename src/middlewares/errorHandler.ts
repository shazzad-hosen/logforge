import { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import { Prisma } from "../generated/prisma/client.ts";
import ApiError from "../utils/ApiError.ts";

const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  request.log.error(error);

  let message = "Internal server error";
  let statusCode = 500;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // common prisma errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = 409;
        message = "A record with the same unique value already exists.";
        break;

      case "P2025":
        statusCode = 404;
        message = "Resource not found.";
        break;

      case "P2003":
        statusCode = 409;
        message = "Foreign key constraint failed.";
        break;

      default:
        statusCode = 500;
        message = "Database error.";
    }
  }

  // normal http errors
  else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  reply.status(statusCode).send({
    success: false,
    statusCode,
    message,
  });
};

export default errorHandler;
