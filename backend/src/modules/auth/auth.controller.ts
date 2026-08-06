import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/common/helper/CatchAsync.js";
import authService from "./auth.container.js";
import { sendResponse } from "../../utils/response/AppResponse.js";

export class AuthController {
  registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password } = req.body;
      const result = await authService.registerUserService({
        name,
        email,
        password,
      });
      sendResponse(res, 200, {
        success: true,
        message: "user create successfully",
        data: result,
      });
    },
  );
}
