import { FastifyRequest, FastifyReply } from "fastify";
import { registerSchema } from "./auth.schema.ts";
import { registerUser } from "./auth.service.ts";

export const registerUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const parsedData = registerSchema.safeParse(request.body);

  if (!parsedData.success) {
    return reply.status(400).send({
      errors: parsedData.error.flatten(),
    });
  }

  const { email, password } = parsedData.data;
  
  const user = await registerUser(email, password);

  return reply.status(201).send({
    message: "User created successfully",
    user,
  });
};
