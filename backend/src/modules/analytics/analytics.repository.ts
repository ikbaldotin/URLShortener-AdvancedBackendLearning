import { ClickAnalytics } from "../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { measureQuery } from "../../utils/common/helper/MeasureQuery.js";
import { IAnalyticsRepository } from "./analytics.interface.js";
import {
  createAnalyticsType,
  RecordClickInputType,
} from "./analytics.types.js";

export class AnalyticsRepository implements IAnalyticsRepository {
  async createAnalytics(data: createAnalyticsType): Promise<ClickAnalytics> {
    return measureQuery("createAnalytics", () =>
      prisma.clickAnalytics.create({
        data,
      }),
    );
  }
  async recordClick(data: RecordClickInputType): Promise<void> {
    measureQuery("recordClick", () =>
      prisma.$transaction([
        prisma.clickAnalytics.create({
          data: {
            shortUrlId: data.shortUrlId,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            referrer: data.referrer,
            country: data.country,
          },
        }),
        prisma.shortURL.update({
          where: {
            id: data.shortUrlId,
          },
          data: {
            clickCount: {
              increment: 1,
            },
          },
        }),
      ]),
    );
  }
}
