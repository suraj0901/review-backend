import Joi from "joi";
import CustomPasswordValidator from "../../utils/customPasswordValidator.js";

const AuthValidation = {
  register: {
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(CustomPasswordValidator),
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  logout: {
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  },
  refreshTokens: {
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  },
  forgotPassword: {
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  },
  resetPassword: {
    query: Joi.object({
      token: Joi.string().required(),
    }),
    body: Joi.object({
      password: Joi.string().required().custom(CustomPasswordValidator),
    }),
  },
  verifyEmail: {
    query: Joi.object({
      token: Joi.string().required(),
    }),
  },
};

export default AuthValidation;
