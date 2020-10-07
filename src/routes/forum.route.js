const express = require("express");
const router = express.Router();
const {
  createQuestionController,
  listQuestionController,
  listQuestionCTController,
  getQuestionController,
  removeQuestionController,
  updateQuestionController,
} = require("../controllers/forum.controller");

// helpers for protected routes
const { authAdmin } = require("../helpers/authAdmin");
const authUser = require("../helpers/authUser");

// validations here
const {
  answerValidator,
} = require("../validators/forum.valid");
const { runValidation } = require("../validators/run.valid");

// routes here
router.post(
  "/create",
  createQuestionController
);
router.get("/questions", listQuestionController);
router.get("/question/:qid", getQuestionController);
router.delete("/question/:qid", authUser, removeQuestionController);
router.put(
  "/question/:qid",
  authUser,
  answerValidator,
  runValidation,
  updateQuestionController
);

module.exports = router;
