import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/common/helper/CatchAsync.js";
import urlService from "./url.container.js";
import { sendResponse } from "../../utils/response/AppResponse.js";

export class UrlController {
  createUrl = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
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
      const originalUrl =
        await urlService.getOriginalUrlFromShortCode(shortCode);
      res.redirect(originalUrl);
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
