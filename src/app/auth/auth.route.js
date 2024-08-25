import { Router } from "express";
import catchAsync from "../../utils/catchAsync.js";
import AuthController from "./auth.controller.js";
import Validate from "../../middleware/validate.js";
import AuthValidation from "./auth.validation.js";

const auth_router = Router();

auth_router.post(
  "/register",
  Validate(AuthValidation.register),
  catchAsync(AuthController.register)
);

auth_router.post(
  "/login",
  Validate(AuthValidation.login),
  catchAsync(AuthController.login)
);

auth_router.post("/logout", catchAsync(AuthController.logout));

auth_router.post(
  "/refresh-tokens",
  // Validate(AuthValidation.refreshTokens),
  catchAsync(AuthController.refreshTokens)
);

auth_router.post(
  "/forgot-password",
  Validate(AuthValidation.forgotPassword),
  catchAsync(AuthController.forgotPassword)
);

auth_router.post(
  "/reset-password",
  Validate(AuthValidation.resetPassword),
  catchAsync(AuthController.resetPassword)
);

auth_router.post(
  "/send-verification-email",
  catchAsync(AuthController.sendVerificationEmail)
);

auth_router.post(
  "/verify-email",
  Validate(AuthValidation.verifyEmail),
  catchAsync(AuthController.verifyEmail)
);

export default auth_router;
