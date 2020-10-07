const express = require("express");
const router = express.Router();
const {
  signupController,
  // activationController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  passwordController,
  deletionController,
} = require("../controllers/auth.controller");

// validators
const { runValidation } = require("../validators/run.valid");
const {
  validSignup,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} = require("../validators/auth.valid");

// admin/user validation
const authUser = require("../helpers/authUser");
const { authAdmin } = require("../helpers/authAdmin");

// routes here
router.post("/signup", validSignup, runValidation, authAdmin, signupController);
// router.post("/activation", activationController);
router.post("/login", validLogin, runValidation, loginController);
router.get("/logout", authUser, logoutController);
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
router.put(
  "/password/change",
  changePasswordValidator,
  runValidation,
  authUser,
  passwordController
);
router.delete("/account/delete", authUser, deletionController);

module.exports = router;
