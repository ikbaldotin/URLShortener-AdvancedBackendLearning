import { ClickAnalytics } from "../../generated/prisma/index.js";
import {
  createAnalyticsType,
  RecordClickInputType,
} from "./analytics.types.js";

export interface IAnalyticsRepository {
  createAnalytics(data: createAnalyticsType): Promise<ClickAnalytics>;
  recordClick(data: RecordClickInputType): Promise<void>;
}
