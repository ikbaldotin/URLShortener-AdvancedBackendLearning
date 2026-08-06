import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { registerUserSchema } from "./auth.schema.js";
import { AuthController } from "./auth.controller.js";
const authController = new AuthController();
const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), authController.registerUser);

export default router;
