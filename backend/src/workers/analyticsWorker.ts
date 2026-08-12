import { Worker } from "bullmq";
import { logger } from "../config/logger.js";
import { deadLetterQueue } from "../queues/deadLetterQueue.js";
import { redisConnection } from "../lib/redis.js";
import analyticsService from "../modules/analytics/analytics.container.js";
import { RecordAnalyticsJob } from "./worker.types.js";
new Worker<RecordAnalyticsJob>(
  "analyticsQueue",
  async (job) => {
    try {
      if (job.name === "record-analytics") {
        logger.info({
          event: "ANALYTICS_JOB_STARTED",
          jobId: job.id,
          jobData: job.data,
          shortUrlId: job.data.shortUrlId,
        });
      }
      await analyticsService.recordClick({
        shortUrlId: job.data.shortUrlId,
        ipAddress: job.data.ipAddress,
        userAgent: job.data.userAgent,
        referrer: job.data.referrer,
      });
      logger.info({
        event: "ANALYTICS_JOB_COMPLETED",
        jobId: job.id,
        jobData: job.data,
        shortUrlId: job.data.shortUrlId,
      });
    } catch (error) {
      logger.error(`Job ${job.id} has failed`);
      await deadLetterQueue.add("failed-analytics", {
        jobName: job.name,
        jobData: job.data,
        error: error instanceof Error ? error.message : "unknown error",
      });
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  },
);
