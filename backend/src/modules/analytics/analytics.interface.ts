import { ClickAnalytics } from "../../generated/prisma/index.js";
import { createAnalyticsType } from "./analytics.types.js";

export interface IAnalyticsRepository {
  createAnalytics(data: createAnalyticsType): Promise<ClickAnalytics>;
}
