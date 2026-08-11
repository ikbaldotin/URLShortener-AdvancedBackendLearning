export type createAnalyticsType = {
  shortUrlId: string;
  clickedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
};
