import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/common/helper/CatchAsync.js";
import prisma from "../../lib/prisma.js";
import redis from "../../lib/redis.js";

export class HealthController {
  live = catchAsync(
    async (_req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({
        success: true,
        alive: true,
        timestamp: new Date().toISOString(),
      });
    },
  );
  ready = catchAsync(
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        await redis.ping();
        return res.status(200).json({
          success: true,
          status: "ready",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          status: "not_ready",
        });
      }
    },
  );
  health = catchAsync(
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        await redis.ping();
        return res.status(200).json({
          success: true,
          status: "health",
          database: "up",
          redis: "up",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          status: "unhealthy",
        });
      }
    },
  );
}
