import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../middleware/authentication.middleware.js";

import { loginSlidingWindowRateLimit } from "../../middleware/rate-limit/login-sliding-window-rate-limit.js";
const authController = new AuthController();
const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), authController.registerUser);
router
  .route("/login")
  .post(
    loginSlidingWindowRateLimit,
    validate(loginUserSchema),
    authController.loginUser,
  );
router.route("/me").get(authMiddleware, authController.getLoggedInUser);
export default router;
