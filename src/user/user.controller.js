import httpStatus from "http-status";
import pick from "../utils/pick.js";
import UserService from "./user.service.js";
import ApiError from "../utils/ApiError.js";

class UserController {
  /**
   * Create User
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  static async createUser(request, response) {
    const user = await UserService.createUser(request.body);
    console.log({ val: user.dataValues });
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
    const options = pick(request.query, ["sortBy", "limit", "page"]);
    const result = await UserService.queryUsers(filter, options);
    response.send(result);
  }

  /**
   * Get User by id
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  static async getUser(request, response) {
    const user = await UserService.getUserById(request.params.id);
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
    const user = await UserService.updateUserById(
      request.params.id,
      request.body
    );
    response.send(user);
  }
}

export default UserController;
