import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/common/helper/CatchAsync.js";
import authService from "./auth.container.js";
import { sendResponse } from "../../utils/response/AppResponse.js";
import { setAuthCookies } from "./auth.helper.js";

export class AuthController {
  registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password } = req.body;
      const result = await authService.registerUserService({
        name,
        email,
        password,
      });
      setAuthCookies(res, result.refreshToken);
      sendResponse(res, 200, {
        success: true,
        message: "user create successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    },
  );
  loginUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await authService.loginUserService(req.body);
      setAuthCookies(res, result.refreshToken);
      sendResponse(res, 200, {
        success: true,
        message: "user login successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    },
  );
  getLoggedInUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.userId as string;
      const result = await authService.loggedInUserDetails(userId);
      sendResponse(res, 200, {
        success: true,
        message: "user details fetched successfully",
        data: result,
      });
    },
  );
}
