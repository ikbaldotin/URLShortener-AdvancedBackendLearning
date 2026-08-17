import { ClickAnalytics } from "../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { measureQuery } from "../../utils/common/helper/MeasureQuery.js";
import { IAnalyticsRepository } from "./analytics.interface.js";
import { createAnalyticsType } from "./analytics.types.js";

export class AnalyticsRepository implements IAnalyticsRepository {
  async createAnalytics(data: createAnalyticsType): Promise<ClickAnalytics> {
    return measureQuery("createAnalytics", () =>
      prisma.clickAnalytics.create({
        data,
      }),
    );
  }
}
