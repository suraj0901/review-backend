import Joi from "joi";
import validator from "validator";
import { ROLES } from "./user.enum.js";

const UserValidation = {
  createUser: Joi.object({
    body: Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      passwrod: Joi.string().required().custom(validator.isStrongPassword),
      role: Joi.string()
        .valid(...Object.values(ROLES))
        .required(),
    }),
  }),
  getUsers: Joi.object({
    query: Joi.object({
      search: Joi.string(),
      role: Joi.string().valid(...Object.values(ROLES)),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  }),
  getUser: Joi.object({
    params: Joi.object({
      userId: Joi.number().required(),
    }),
  }),
  updateUser: Joi.object({
    params: Joi.object({
      userId: Joi.number().required(),
    }),
    body: Joi.object({
      email: Joi.string().email(),
      passwrod: Joi.string().custom(validator.isStrongPassword),
      name: Joi.string().min(3),
    }).min(1),
  }),
  deleteUser: Joi.object({
    params: Joi.object({
      userId: Joi.number().required(),
    }),
  }),
};

export default UserValidation;
