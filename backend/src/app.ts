import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import { env } from "./config/env.config.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { sendResponse } from "./utils/response/AppResponse.js";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(
  cors({
    origin: env.FRONTEND_URL,
  }),
);
app.use(cookieParser());
import authRouter from "./modules/auth/auth.route.js";
app.use("/api/v1/auth", authRouter);
app.use(globalErrorHandler);
