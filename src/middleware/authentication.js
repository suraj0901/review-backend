import httpStatus from "http-status";
import passport from "passport";
import { UserModel } from "../app/user/user.model.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { ROLES_PERMISSION } from "../config/role.enum.js";

export function authorize(requiredRights = []) {
  return catchAsync(function (req, _res, next) {
    /**@type {UserModel} */
    const user = req.user;
    if (requiredRights.length === 0) return next();
    const userRights = ROLES_PERMISSION[user.role];
    console.log({ requiredRights, userRights, role: user.role });
    const hasRequiredRights = requiredRights.every((requiredRight) =>
      userRights.includes(requiredRight)
    );
    if (!hasRequiredRights)
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not Authorized");
    next();
  });
}

export function authenticate(role) {
  const auth_middleware = passport.authenticate("jwt", { session: false });
  if (role) return [auth_middleware, authorize(role)];
  return auth_middleware;
}
