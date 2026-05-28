import { app } from "./app.ts";
import { ENV } from "./config/env.ts";
import { prisma } from "./plugins/prisma.ts";

const startServer = async () => {
  await prisma.$connect();
  console.log("Database connected");

  try {
    await app.listen({
      port: ENV.PORT,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${ENV.PORT}`);
  } catch (error) {
    app.log.error(error);

    process.exit(1);
  }
};

startServer();
