import validator from "validator";
import ApiError from "./ApiError.js";
import httpStatus from "http-status";

export default function CustomPasswordValidator(value) {
  if (validator.isStrongPassword(value)) {
    return value;
  }
  throw new ApiError(
    httpStatus.BAD_REQUEST,
    "Please provide a strong password"
  );
}
