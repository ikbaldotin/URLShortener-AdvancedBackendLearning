import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { urlSchema } from "./url.schema.js";
import { authMiddleware } from "../../middleware/authentication.middleware.js";
import { UrlController } from "./url.controller.js";
const urlController = new UrlController();
const router = express.Router();
router
  .route("/create-short-url")
  .post(validate(urlSchema), authMiddleware, urlController.createUrl);
router.route("/:shortCode").get(urlController.redirectToOriginalURL);
export default router;
