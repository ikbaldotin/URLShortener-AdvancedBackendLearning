import { User } from "../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import { registerUserType } from "./auth.types.js";

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  async createUser(data: registerUserType): Promise<User> {
    const newUser = await prisma.user.create({
      data,
    });
    return newUser;
  }
  async findUserById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }
}
