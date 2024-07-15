import httpStatus from "http-status";
import ApiError from "../../utils/ApiError.js";
import pick from "../../utils/pick.js";
import UserService from "./user.service.js";

class UserController {
  /**
   * Create User
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  static async createUser(request, response) {
    const options = pick(request.query, ["select", "exclude", "populate"]);
    const user = await UserService.createUser(request.body, options);
    delete user.dataValues.password;
    response.status(httpStatus.CREATED).send(user);
  }

  /**
   * Get all Users with options
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  static async getUsers(request, response) {
    const filter = pick(request.query, ["role", "search"]);
    const options = pick(request.query, [
      "sortBy",
      "limit",
      "page",
      "select",
      "exclude",
      "populate",
    ]);
    const result = await UserService.queryUsers(filter, options);
    response.send(result);
  }

  /**
   * Get User by id
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  static async getUser(request, response) {
    const options = pick(request.query, ["select", "exclude", "populate"]);
    const user = await UserService.getUserById(request.params.userId, options);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    response.send(user);
  }

  /**
   * Update User by id
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  static async updateUser(request, response) {
    const options = pick(request.query, ["select", "exclude", "populate"]);
    // let profile_image = null;
    // if (request.files) {
    //   profile_image = Buffer.from(request.files[0].buffer).toString("base64");
    //   profile_image = `data:image/png;base64,${profile_image}`;
    // }
    const user = await UserService.updateUserById(
      request.params.userId,
      request.body,
      options
    );
    response.send(user);
  }

  /**
   * Delete User by id
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  static async deleteUser(request, response) {
    await UserService.deleteUserById(request.params.userId);
    response.status(httpStatus.NO_CONTENT).send();
  }
}

export default UserController;
