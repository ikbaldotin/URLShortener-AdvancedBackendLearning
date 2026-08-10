import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { createUrlSchema, updateUrlSchema } from "./url.schema.js";
import { authMiddleware } from "../../middleware/authentication.middleware.js";
import { UrlController } from "./url.controller.js";
const urlController = new UrlController();
const router = express.Router();
router
  .route("/create-short-url")
  .post(validate(createUrlSchema), authMiddleware, urlController.createUrl);
router.route("/:shortCode").get(urlController.redirectToOriginalURL);
router
  .route("/:shortCode")
  .patch(
    validate(updateUrlSchema),
    authMiddleware,
    urlController.updateOriginalURl,
  );
export default router;
