export type createShortUrl = {
  originalUrl: string;
  userId: string;
  shortCode: string;
};

export type updateShortUrlType = {
  updateOriginalUrl: string;
};
export type shortUrlType = {
  id: string;
  originalUrl: string;
  userId: shortUrlType;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
};
export type UrlCursor = {
  createdAt: Date;
  id: string;
};
