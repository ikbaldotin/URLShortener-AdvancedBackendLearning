import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/common/helper/CatchAsync.js";
import urlService from "./url.container.js";
import { sendResponse } from "../../utils/response/AppResponse.js";
import analyticsService from "../analytics/analytics.container.js";
import { analyticsQueue } from "../../queues/analyticsQueue.js";

export class UrlController {
  createUrl = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("CREATE SHORT URL CONTROLLER START");
      const { originalUrl } = req.body;
      const userId = req.user?.userId as string;

      const result = await urlService.createShortUrl({ originalUrl }, userId);
      sendResponse(res, 200, {
        success: true,
        message: "Short code created successfully",
        data: result,
      });
    },
  );
  redirectToOriginalURL = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const shortCode = req.params.shortCode as string;

      const shortUrl = await urlService.getOriginalUrlFromShortCode(shortCode);
      await analyticsQueue.add(
        "record-analytics",
        {
          shortUrlId: shortUrl.id,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          referrer: req.get("Referer"),
        },
        {
          attempts: 5,
          backoff: {
            type: "exponential",
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 5000,
        },
      );
      // await analyticsService.recordClick(shortUrl, req);
      res.redirect(shortUrl.originalUrl);
    },
  );
  updateOriginalURl = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const shortCode = req.params.shortCode as string;
      const userId = req.user?.userId as string;
      const { updateOriginalUrl } = req.body;
      const result = await urlService.updateOriginalUrl(userId, shortCode, {
        updateOriginalUrl,
      });
      sendResponse(res, 200, {
        success: true,
        message: "Origianl url updated successfully",
        data: result,
      });
    },
  );
}
