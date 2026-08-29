import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import { env } from "./config/env.config.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import authRouter from "./modules/auth/auth.route.js";
import urlRouter from "./modules/url/url.route.js";
import { globalRateLimiter } from "./middleware/rate-limit/global-rate-limit.middleware.js";
import { HealthController } from "./modules/health-check/health.controller.js";

export const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
const healthController = new HealthController();
app.use("/live", healthController.live);
app.use("/ready", healthController.ready);
app.use("/health", healthController.health);
app.use(globalRateLimiter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", urlRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("working");
});
app.use(globalErrorHandler);
