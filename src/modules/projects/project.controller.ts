import { FastifyRequest, FastifyReply } from "fastify";
import { createProjectSchema } from "./project.schema.ts";

import { createProject, getProjects } from "./project.service.ts";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: "user" | "admin";
  isVerified: boolean;
}

export const createProjectController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.user as AuthenticatedUser;

  const parsedData = createProjectSchema.safeParse(request.body);

  if (!parsedData.success) {
    const errors = Object.fromEntries(
      parsedData.error.issues.map((i) => [i.path[0], i.message]),
    );
    return reply.status(400).send({ errors });
  }

  const { name, description } = parsedData.data;

  const project = await createProject(user.id, name, description);

  return reply.status(201).send({
    success: true,
    message: "Project created successfully",
    ...project,
  });
};

export const getProjectsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.user as AuthenticatedUser;

  const projects = await getProjects(user.id);

  return reply.status(200).send({
    success: true,
    ...projects,
  });
};
