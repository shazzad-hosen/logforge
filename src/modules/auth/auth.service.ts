import { createUser, findUserByEmail } from "./auth.repository.ts";
import ApiError from "../../utils/ApiError.ts";
import { hashPassword, comparePassword } from "./utils/bcrypt.ts";

export const registerUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser(email, passwordHash);

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
};
