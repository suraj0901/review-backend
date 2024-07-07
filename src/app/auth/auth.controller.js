import httpStatus from "http-status";
import UserService from "../user/user.service.js";
import AuthService from "./auth.service.js";
import EmailService from "./email.service.js";
import TokenService from "./token.service.js";
import ApiError from "../../utils/ApiError.js";
import { env } from "../../config/env.js";

class AuthController {
  /**
   * Get cookies option
   * @param {Number} expireIn
   * @returns {import("express").CookieOptions}
   */
  static getCookiesOption(expireIn) {
    const is_production = env === "production";
    return {
      httpOnly: is_production,
      sameSite: "none",
      secure: true,
      expires: expireIn,
    };
  }
  static REFRESH_TOKEN = "refresh_token";

  /**
   * Register User
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  static async register(request, response) {
    const user = await UserService.createUser(request.body);
    const token = await TokenService.generateAuthToken(user);
    response.cookie(
      AuthController.REFRESH_TOKEN,
      token.refresh.token,
      AuthController.getCookiesOption(token.refresh.expires)
    );
    response.status(httpStatus.CREATED).send({ user, token: token.access });
  }

  /**
   * Login User
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  static async login(request, response) {
    const { email, password } = request.body;
    const user = await AuthService.loginWithEmailAndPassword(email, password);
    const token = await TokenService.generateAuthToken(user);
    response.cookie(
      AuthController.REFRESH_TOKEN,
      token.refresh.token,
      AuthController.getCookiesOption(token.refresh.expires)
    );
    response.send({ user, token: token.access });
  }

  /**
   * Login User
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  static async logout(request, response) {
    const refreshToken = request.cookies[AuthController.REFRESH_TOKEN];
    console.log({ refreshToken });
    if (!refreshToken)
      throw new ApiError(httpStatus.BAD_REQUEST, "No refresh token available");
    await AuthService.logout(refreshToken);
    response.clearCookie(AuthController.REFRESH_TOKEN);
    response.status(httpStatus.NO_CONTENT).send();
  }

  /**
   * Refresh Tokens
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  static async refreshTokens(request, response) {
    const refreshToken = request.cookies[AuthController.REFRESH_TOKEN];
    const tokens = await AuthService.refreshAuth(refreshToken);
    response.cookie(
      AuthController.REFRESH_TOKEN,
      tokens.refresh,
      AuthController.cookiesOption
    );
    response.send({ token: tokens.access });
  }

  /**
   * Forgot password
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  static async forgotPassword(request, response) {
    const resetPasswordToken = await TokenService.generateResetPasswordToken(
      request.body.email
    );
    await EmailService.sendResetPasswordEmail(
      request.body.email,
      resetPasswordToken
    );
    response
      .status(httpStatus.NO_CONTENT)
      .send("Check email for reset password link.");
  }

  /**
   * Reset password
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  static async resetPassword(request, response) {
    await AuthService.resetPassword(request.query.token, request.body.password);
    response.status(httpStatus.NO_CONTENT).send("Password reset successfully");
  }

  /**
   * Send verification email
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  static async sendVerificationEmail(request, response) {
    const verifyEmailToken = await TokenService.generateVerifyEmailToken(
      request.user
    );
    await EmailService.sendVerificationEmail(
      request.user.email,
      verifyEmailToken
    );
    response.status(httpStatus.NO_CONTENT).send();
  }

  /**
   * Verify email
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  static async verifyEmail(request, response) {
    await AuthService.verifyEmail(request.query.token);
    response.status(httpStatus.NO_CONTENT).send();
  }
}

export default AuthController;
