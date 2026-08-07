import { AppError } from "../../utils/common/Errors/App.Error.js";
import {
  comparePassword,
  hashPassword,
  signAccessToken,
  signRefreshToken,
} from "./auth.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toUserResponse } from "./auth.response.js";
import { loginUserDTO, registerUserDTO } from "./auth.schema.js";

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}
  async registerUserService(data: registerUserDTO) {
    const exitingUser = await this.authRepo.findUserByEmail(data.email);
    if (exitingUser) {
      throw new AppError("user already exists", 404);
    }
    const hashedPassword = await hashPassword(data.password);
    const user = await this.authRepo.createUser({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
    });
    const accessToken = signAccessToken({
      userId: user.id,
    });
    const refreshToken = signRefreshToken({
      userId: user.id,
    });
    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }
  async loginUserService(data: loginUserDTO) {
    const user = await this.authRepo.findUserByEmail(data.email);
    if (!user) {
      throw new AppError("invalid credentials", 401);
    }
    const verifyPassword = await comparePassword(
      data.password,
      user.passwordHash,
    );
    if (!verifyPassword) {
      throw new AppError("invalid credentials", 401);
    }
    const accessToken = signAccessToken({
      userId: user.id,
    });
    const refreshToken = signRefreshToken({
      userId: user.id,
    });
    return {
      user: toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }
  async loggedInUserDetails(userId: string) {
    const user = await this.authRepo.findUserById(userId);
    if (!user) {
      throw new AppError("user not found", 404);
    }
    return toUserResponse(user);
  }
}
