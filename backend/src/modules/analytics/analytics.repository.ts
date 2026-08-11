import { ClickAnalytics } from "../../generated/prisma/index.js";
import prisma from "../../lib/prisma.js";
import { IAnalyticsRepository } from "./analytics.interface.js";
import { createAnalyticsType } from "./analytics.types.js";

export class AnalyticsRepository implements IAnalyticsRepository {
  async createAnalytics(data: createAnalyticsType): Promise<ClickAnalytics> {
    return await prisma.clickAnalytics.create({
      data,
    });
  }
}
