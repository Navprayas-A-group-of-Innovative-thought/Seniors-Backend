const express = require("express");
const router = express.Router();

// controllers
const {
  createCollegeController,
  getAllCollegesController,
  getCollegeController,
  updateCollegeController,
  deleteCollegeController,
  reviewDeleteController,
} = require("../controllers/college.controller");

// validators
const { validCollege, validReview } = require("../validators/college.valid");
const { runValidation } = require("../validators/run.valid");

// helpers for protected routes
const { authAdmin } = require("../helpers/authAdmin");
const authUser = require("../helpers/authUser");

// routes
router.post(
  "/create",
  authAdmin,
  validCollege,
  runValidation,
  createCollegeController
);
router.get("/all", getAllCollegesController);
router.get("/:collegeID", getCollegeController);
router.put(
  "/update/:collegeID",
  authUser,
  validReview,
  updateCollegeController
);
router.delete("/:collegeID", authAdmin, deleteCollegeController);
router.delete("/:collegeID/review", authUser, reviewDeleteController);

module.exports = router;
