import { Router } from "express";
import Validate from "../middleware/validate.js";
import catchAsync from "../utils/catchAsync.js";
import UserController from "./user.controller.js";
import UserValidation from "./user.validation.js";

const user_router = Router();

user_router
  .route("/")
  .get(Validate(UserValidation.getUsers), catchAsync(UserController.getUsers))
  .post(
    Validate(UserValidation.createUser),
    catchAsync(UserController.createUser)
  );

user_router
  .route("/:userId")
  .get(Validate(UserValidation.getUser), catchAsync(UserController.getUser))
  .put(
    Validate(UserValidation.updateUser),
    catchAsync(UserController.updateUser)
  )
  .delete(
    Validate(UserValidation.deleteUser),
    catchAsync(UserController.deleteUser)
  );
export default user_router;
