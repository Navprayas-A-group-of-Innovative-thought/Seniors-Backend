const express = require("express");
const router = express.Router();
// admin controllers
const {
  adminSignupController,
  adminLoginController,
  adminLogoutController,
  adminForgotPasswordController,
  adminResetPasswordController,
  adminPasswordController,
  adminDeletionController,
} = require("../controllers/admin.controller");

// validators
const { runValidation } = require("../validators/run.valid");
const {
  validAdminSignup,
  validAdminLogin,
  adminForgotPasswordValidator,
  adminResetPasswordValidator,
  adminChangePasswordValidator,
} = require("../validators/admin.valid");

// admin validation
const { authAdmin } = require("../helpers/authAdmin");

// routes here
router.post("/signup", validAdminSignup, runValidation, adminSignupController);
router.post("/login", validAdminLogin, runValidation, adminLoginController);
router.get("/logout", adminLogoutController);
router.put(
  "/password/forgot",
  adminForgotPasswordValidator,
  runValidation,
  adminForgotPasswordController
);
router.put(
  "/password/reset",
  adminResetPasswordValidator,
  runValidation,
  adminResetPasswordController
);
router.put(
  "/password/change",
  adminChangePasswordValidator,
  runValidation,
  authAdmin,
  adminPasswordController
);
router.delete("/account/delete", authAdmin, adminDeletionController);

module.exports = router;
