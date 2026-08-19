export type createAnalyticsType = {
  shortUrlId: string;
  clickedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
};
export type requestMetaDataType = {
  ipAddress: string;
  userAgent: string;
  referrer: string;
};
export type RecordClickInputType = {
  shortUrlId: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
};
