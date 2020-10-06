const express = require("express");
const router = express.Router();
const {
  signupController,
  activationController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/auth.controller");

// validators
const { runValidation } = require("../validators/run.valid");
const {
  validSignup,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth.valid");

// routes here
router.post("/signup", validSignup, runValidation, signupController);
router.post("/activation", activationController);
router.post("/login", validLogin, runValidation, loginController);
router.get("/logout", logoutController);
router.put(
  "/password/forgot",
  forgotPasswordValidator,
  runValidation,
  forgotPasswordController
);
router.put(
  "/password/reset",
  resetPasswordValidator,
  runValidation,
  resetPasswordController
);

module.exports = router;
