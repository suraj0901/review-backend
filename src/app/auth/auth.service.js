import httpStatus from "http-status";
import ApiError from "../../utils/ApiError.js";
import UserService from "../user/user.service.js";
import Token from "./token.model.js";
import { TOKEN_TYPE } from "./token.enum.js";
import TokenService from "./token.service.js";

class AuthService {
  /**
   * Login user with email and password
   * @param {string} email
   * @param {string} password
   */
  static async loginWithEmailAndPassword(email, password) {
    const user = await UserService.getUserByEmail(email, {}, true);
    if (!user || !user.compare_passowrd(password)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
    return user;
  }

  /**
   * Logout
   * @param {string} refreshToken
   */
  static async logout(refreshToken) {
    const refreshTokenDocument = await Token.findOne({
      where: { token: refreshToken, type: TOKEN_TYPE.REFRESH },
    });
    if (!refreshTokenDocument) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
    }
    await refreshTokenDocument.destroy();
  }

  /**
   * Refresh auth tokens
   * @param {string} refreshToken
   */
  static async refreshAuth(refreshToken) {
    const refreshTokenDocument = await TokenService.verifyToken(
      refreshToken,
      TOKEN_TYPE.REFRESH
    );
    const userId = refreshTokenDocument.dataValues.UserId;
    const user = await UserService.getUserById(userId);
    if (!user)
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
    await refreshTokenDocument.destroy();
    return TokenService.generateAuthToken(user);
  }

  /**
   * Reset password
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   */
  static async resetPassword(resetPasswordToken, newPassword) {
    const resetPasswordTokenDocument = await TokenService.verifyToken(
      resetPasswordToken,
      TOKEN_TYPE.RESET_PASSWORD
    );

    const user = await UserService.getUserById(
      resetPasswordTokenDocument.dataValues.UserId
    );
    if (!user)
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
    await UserService.updateUserById(user.id, {
      password: newPassword,
      isEmailVerified: true,
    });
    await Token.destroy({
      where: {
        userId: user.id,
        type: TOKEN_TYPE.RESET_PASSWORD,
      },
    });
  }

  static async verifyEmail(verifyEmailToken) {
    const verifyEmailDocument = await TokenService.verifyToken(
      verifyEmailToken,
      TOKEN_TYPE.VERIFY_EMAIL
    );
    const user = await UserService.getUserById(
      verifyEmailDocument.dataValues.UserId
    );
    if (!user)
      throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
    await Token.destroy({
      where: {
        userId: user.id,
        type: TOKEN_TYPE.VERIFY_EMAIL,
      },
    });
    await UserService.updateUserById(user.id, { isEmailVerified: true });
  }
}

export default AuthService;
