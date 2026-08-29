import { User } from "../../../generated/prisma/index.js";
import { registerUserType } from "./auth.types.js";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(userId: string): Promise<User | null>;
  createUser(data: registerUserType): Promise<User>;
}
