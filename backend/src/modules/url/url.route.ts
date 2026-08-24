import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { createUrlSchema, updateUrlSchema } from "./url.schema.js";
import { authMiddleware } from "../../middleware/authentication.middleware.js";
import { UrlController } from "./url.controller.js";

import { shortUrlTokenBucketRateLimit } from "../../middleware/rate-limit/short-url-token-bucket-rate-limit.js";
const urlController = new UrlController();
const router = express.Router();
router
  .route("/create-short-url")
  .post(
    authMiddleware,
    shortUrlTokenBucketRateLimit,
    validate(createUrlSchema),
    urlController.createUrl,
  );
router.route("/:shortCode").get(urlController.redirectToOriginalURL);
router
  .route("/:shortCode")
  .patch(
    validate(updateUrlSchema),
    authMiddleware,
    urlController.updateOriginalURl,
  );
router.route("/").get(authMiddleware, urlController.getUserUrls);
router
  .route("/:id/analytics")
  .get(authMiddleware, urlController.getUrlAnalytics);
export default router;
