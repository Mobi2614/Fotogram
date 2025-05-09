const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");

const logger = require("../config/logger");
const httpStatus = require("http-status");
const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

router.get("/me", auth("creator", "consumer"), (req, res) =>
  res.status(httpStatus.OK).send(req.user)
);
router.get(
  "/verify-email",
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);
router.post("/login", validate(authValidation.login), authController.login);
router.delete(
  "/logout/:userId",
  validate(authValidation.logout),
  authController.logout
);

router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPassword
);
router.post(
  "/send-otp",
  validate(authValidation.sendOtp),
  authController.sendOtp
);
router.post(
  "/verify-otp",
  validate(authValidation.verifyOtp),
  authController.verifyUserOtp
);

router.post(
  "/change-password",
  validate(authValidation.changePassword),
  authController.changePassword
);

module.exports = router;
