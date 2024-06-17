import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";
import User from "./user.model.js";
import paginationUtil from "../utils/paginationUtil.js";
import optionSchema from "../utils/optionSchema.js";
import parseOptions from "../utils/parseOptions.js";

class UserService {
  /**
   * Create a user
   * @param {Object} user_body
   * @returns {Promise<User>}
   */
  static async createUser(user_body) {
    if (await User.isEmailTaken(user_body.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email is already taken");
    }

    const user = await User.create(user_body);
    return user;
  }

  /**
   * Query for users
   * @param {Object} filter - Filter by field
   * @param {Object} options - Query options
   * @param {string} [options.sortBy]
   * @param {number} [options.limit]
   * @param {number} [options.page]
   */
  static async queryUsers(filter, options) {
    const queryOptions = paginationUtil(filter, options);
    const { attributes, include } = parseOptions(options);
    const users = await User.findAndCountAll({
      ...queryOptions,
      attributes,
      include,
    });
    return users;
  }

  /**
   * Get user by id
   * @param {number} id
   * @returns {Promise<User>}
   */
  static async getUserById(id, options) {
    const { attributes, include } = parseOptions(options);
    return User.findByPk(id, {
      attributes,
      include,
    });
  }

  /**
   * Update user by id
   * @param {number} userId
   * @param {Object} udpateBody
   */
  static async updateUserById(userId, udpateBody, options) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    if (
      udpateBody.email &&
      (await User.isEmailTaken(udpateBody.email, userId))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    Object.assign(user, udpateBody);
    await user.save();
    return user;
  }

  /**
   * Delete user by id
   * @param {number} userId
   */
  static async deleteUserById(userId) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await user.destroy();
    return user;
  }
}

export default UserService;
