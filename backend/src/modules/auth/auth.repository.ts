import { User } from "../../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { measureQuery } from "../../utils/common/helper/MeasureQuery.js";
import { IAuthRepository } from "./auth.interface.js";
import { registerUserType } from "./auth.types.js";

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return measureQuery("findUserByEmail", () =>
      prisma.user.findUnique({
        where: {
          email,
        },
      }),
    );
  }
  async createUser(data: registerUserType): Promise<User> {
    return measureQuery("createUser", () =>
      prisma.user.create({
        data,
      }),
    );
  }
  async findUserById(userId: string): Promise<User | null> {
    return measureQuery("findUserById", () =>
      prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
    );
  }
}
