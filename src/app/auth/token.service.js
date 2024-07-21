import { addDays, addMinutes, getUnixTime, toDate } from "date-fns";
import httpStatus from "http-status";
import jsonwebtoken from "jsonwebtoken";
import { jwt } from "../../config/env.js";
import ApiError from "../../utils/ApiError.js";
import { UserModel } from "../user/user.model.js";
import UserService from "../user/user.service.js";
import { TOKEN_TYPE } from "./token.enum.js";
import Token from "./token.model.js";

const { sign, verify } = jsonwebtoken;

export default class TokenService {
  /**
   * Create token
   * @param {UserModel} user
   * @param {Date} expires
   * @param {string} type
   * @param {string} [secret]
   */
  static generateToken(user, expires, type, secret = jwt.secret) {
    const payload = {
      sub: { id: user.id, role: user.role },
      iat: getUnixTime(new Date()),
      exp: getUnixTime(expires),
      type,
    };
    return sign(payload, secret);
  }

  /**
   * Save token to database
   * @param {string} token
   * @param {UserModel} user
   * @param {Date} expires
   * @param {string} type
   * @returns {Promise<Token>}
   */
  static async saveToken(token, user, expires, type) {
    const tokenDocument = await Token.create({
      token,
      UserId: user.id,
      expires: toDate(expires),
      type,
    });
    return tokenDocument;
  }

  /**
   * Verify token
   * @param {string} token
   * @param {string} type
   */
  static async verifyToken(token, type) {
    const payload = verify(token, jwt.secret);
    const tokenDocument = await Token.findOne({
      where: {
        token,
        type,
        userId: payload.sub.id,
      },
    });
    if (!tokenDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
    }
    return tokenDocument;
  }

  /**
   * Create access and refresh token
   * @param {UserModel} user
   */
  static async generateAuthToken(user) {
    const accessTokenExpires = addMinutes(
      new Date(),
      jwt.accessExpirationMinutes
    );

    const accessToken = this.generateToken(
      user,
      accessTokenExpires,
      TOKEN_TYPE.ACCESS
    );

    const refreshTokenExpires = addDays(new Date(), jwt.refreshExpirationDays);

    const refreshToken = this.generateToken(
      user,
      refreshTokenExpires,
      TOKEN_TYPE.REFRESH
    );

    await this.saveToken(
      refreshToken,
      user,
      refreshTokenExpires,
      TOKEN_TYPE.REFRESH
    );

    return {
      access: {
        token: accessToken,
        expires: toDate(accessTokenExpires),
      },
      refresh: {
        token: refreshToken,
        expires: toDate(refreshTokenExpires),
      },
    };
  }

  /**
   * Create reset password token
   * @param {string} email
   */
  static async generateResetPasswordToken(email) {
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "No Users found with this email"
      );
    }

    const resetPasswordTokenExpires = addMinutes(
      new Date(),
      jwt.resetPasswordExpirationMinutes
    );

    const resetPasswordToken = this.generateToken(
      user,
      resetPasswordTokenExpires,
      TOKEN_TYPE.RESET_PASSWORD
    );

    await this.saveToken(
      resetPasswordToken,
      user,
      resetPasswordTokenExpires,
      TOKEN_TYPE.RESET_PASSWORD
    );

    return resetPasswordToken;
  }
  /**
   * Create verify email token
   * @param {UserModel} user
   */
  static async generateVerifyEmailToken(user) {
    const verifyEmailTokenExpires = addMinutes(
      new Date(),
      jwt.verifyEmailExpirationMinutes
    );
    const verifyEmailToken = this.generateToken(
      user,
      verifyEmailTokenExpires,
      TOKEN_TYPE.VERIFY_EMAIL
    );
    await this.saveToken(
      verifyEmailToken,
      user,
      verifyEmailTokenExpires,
      TOKEN_TYPE.VERIFY_EMAIL
    );
    return verifyEmailToken;
  }
}
