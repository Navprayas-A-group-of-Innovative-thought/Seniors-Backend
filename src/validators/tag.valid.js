const { check } = require("express-validator");

exports.tagValidator = [
  check("name").not().isEmpty().withMessage("Name cannot be blank."),
];
