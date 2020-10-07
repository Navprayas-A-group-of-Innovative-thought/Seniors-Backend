const { check } = require("express-validator");

exports.answerValidator = [
  check("answer").not().isEmpty().withMessage("Answer cannot be blank."),
];