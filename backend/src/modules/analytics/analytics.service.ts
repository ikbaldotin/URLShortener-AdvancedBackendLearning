import { AppError } from "../../utils/common/Errors/App.Error.js";
import { IUrlRepository } from "../url/url.interface.js";
import { decodedCursor, encodeCursor } from "./analytics.helper.js";
import { IAnalyticsRepository } from "./analytics.interface.js";
import { RecordClickInputType } from "./analytics.types.js";

export class AnalyticsService {
  constructor(
    private analyticsRepo: IAnalyticsRepository,
    private urlRepo: IUrlRepository,
  ) {}
  async recordClick(data: RecordClickInputType) {
    await this.analyticsRepo.createAnalytics({
      shortUrlId: data.shortUrlId,
      clickedAt: new Date(),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      referrer: data.referrer,
    });
  }
  async getAnalytics(
    userId: string,
    shortUrlId: string,
    limit: number,
    cursor?: string,
  ) {
    const shortUrl = await this.urlRepo.findShortUrlByIdandUserId(
      shortUrlId,
      userId,
    );
    if (!shortUrl) {
      throw new AppError("You are not allowed to perform this action", 401);
    }
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const decodeCursor = cursor ? decodedCursor(cursor) : undefined;
    const analytics = await this.analyticsRepo.findAnalyticsByShortUrlId(
      shortUrlId,
      safeLimit,
      decodeCursor,
    );

    const hasMore = analytics.length > safeLimit;
    const items = hasMore ? analytics.slice(0, safeLimit) : analytics;
    const nextCursor = cursor
      ? encodeCursor({
          clickedAt: items[items.length - 1].clickedAt,
          id: items[items.length - 1].id,
        })
      : undefined;
    return {
      items,
      nextCursor,
      hasMore,
    };
  }
}
