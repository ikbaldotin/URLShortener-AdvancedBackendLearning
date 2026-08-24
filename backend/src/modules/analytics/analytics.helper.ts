import { AnalyticsCursorType } from "./analytics.types.js";

export const encodeCursor = (cursor: AnalyticsCursorType): string => {
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
};
export const decodedCursor = (cursor: string): AnalyticsCursorType => {
  const decoded = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  return {
    clickedAt: new Date(decoded.clickedAt),
    id: decoded.id,
  };
};
