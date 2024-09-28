import { Router } from "express";
import Validate from "../../middleware/validate.js";
import catchAsync from "../../utils/catchAsync.js";
import UserController from "./user.controller.js";
import UserValidation from "./user.validation.js";
import { authenticate, authorize } from "../../middleware/authentication.js";
import { PERMISSION } from "../../config/role.enum.js";

const user_router = Router();

user_router
  .route("/")
  .get(
    authorize([PERMISSION.GET_USER]),
    Validate(UserValidation.getUsers),
    catchAsync(UserController.getUsers)
  )
  .post(
    authorize([PERMISSION.MANAGE_USER]),
    Validate(UserValidation.createUser),
    catchAsync(UserController.createUser)
  );
user_router.put(
  "/profile",
  authenticate([PERMISSION.UPDATE_USER]),
  catchAsync(UserController.updateProfile)
);

user_router
  .route("/:userId")
  .get(
    authorize([PERMISSION.GET_USER]),
    Validate(UserValidation.getUser),
    catchAsync(UserController.getUser)
  )
  .put(
    authorize([PERMISSION.MANAGE_USER]),
    Validate(UserValidation.updateUser),
    catchAsync(UserController.updateUser)
  )
  .delete(
    authorize([PERMISSION.MANAGE_USER]),
    Validate(UserValidation.deleteUser),
    catchAsync(UserController.deleteUser)
  );

export default user_router;
