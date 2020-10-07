//Validation helper
const { check } = require("express-validator");
import regeneratorRuntime from "regenerator-runtime";

exports.validCollege = [
  check("name", "Name cannot be empty.").notEmpty().trim(),
  check("collegeID", "ID must be assigned to college").notEmpty().trim(),
];

exports.validReview = [
  check("review", "Review is required.").notEmpty().trim(),
];
