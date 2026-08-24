import { UrlRepository } from "../url/url.repository.js";
import { AnalyticsRepository } from "./analytics.repository.js";
import { AnalyticsService } from "./analytics.service.js";

const analyticsRepository = new AnalyticsRepository();
const urlRepository = new UrlRepository();
const analyticsService = new AnalyticsService(
  analyticsRepository,
  urlRepository,
);
export default analyticsService;
