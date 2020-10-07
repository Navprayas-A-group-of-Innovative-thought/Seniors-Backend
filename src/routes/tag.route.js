const express = require("express");
const router = express.Router();

// controllers
const {
  createTagController,
  listTagController,
  readTagController,
  removeTagController,
} = require("../controllers/tag.controller");

// validators
const { runValidation } = require("../validators/run.valid");
const { tagValidator } = require("../validators/tag.valid");

// helpers for protected routes
const { authAdmin } = require("../helpers/authAdmin");
const authUser = require("../helpers/authUser");

// routers
router.post(
  "/create",
  tagValidator,
  runValidation,
  createTagController
);
router.get("/all", listTagController);
router.get("/:slug", readTagController);
router.delete(
  "/:slug",
  authAdmin,
  removeTagController
);

module.exports = router;
