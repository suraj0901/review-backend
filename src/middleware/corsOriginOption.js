import httpStatus from "http-status";
import { allowedOrigins } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

export default function corsOriginOption(origin, callback) {
  console.log({ allowedOrigins, origin });
  if (!origin || allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(
      new ApiError(httpStatus.BAD_REQUEST, "Request from unauthorised orign"),
      null
    );
  }
}
