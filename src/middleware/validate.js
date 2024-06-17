import httpStatus from "http-status";
import Joi from "joi";
import ApiError from "../utils/ApiError.js";
import pick from "../utils/pick.js";

/**
 *
 * @param {Joi.ObjectSchema<any>} schema
 * @returns
 */
export default function Validate(schema) {
  const validSchema = pick(schema, ["params", "query", "body"]);
  return function (request, _response, next) {
    const object = pick(request, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({
        errors: { label: "key" },
        abortEarly: false,
      })
      .validate(object);
    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(request, value);
    return next();
  };
}
