import Joi from "joi";
import CustomPasswordValidator from "../../utils/customPasswordValidator.js";
import optionSchema from "../../utils/optionSchema.js";
import paginationSchema from "../../utils/paginationSchema.js";
import { GENDER, ROLES } from "../../config/role.enum.js";

const UserValidation = {
  createUser: {
    query: Joi.object(optionSchema),
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      gender: Joi.string()
        .valid(...Object.values(GENDER))
        .required(),
      password: Joi.string().required().custom(CustomPasswordValidator),
      role: Joi.string().valid(...Object.values(ROLES)),
      profile_image: Joi.string().optional(),
    }),
  },
  getUsers: {
    query: Joi.object({
      role: Joi.string().valid(...Object.values(ROLES)),
      ...paginationSchema,
      ...optionSchema,
    }),
  },
  getUser: {
    params: Joi.object({
      userId: Joi.number().required(),
    }),
    query: Joi.object(optionSchema),
  },
  updateUser: {
    params: Joi.object({
      userId: Joi.number().required(),
    }),
    body: Joi.object({
      email: Joi.string().email().optional(),
      passwrod: Joi.string().custom(CustomPasswordValidator).optional(),
      name: Joi.string().min(3).optional(),
      gender: Joi.string()
        .valid(...Object.values(GENDER))
        .optional(),
      profile_image: Joi.string().optional(),
    }).min(1),
    query: Joi.object(optionSchema),
  },
  deleteUser: {
    params: Joi.object({
      userId: Joi.number().required(),
    }),
  },
};

export default UserValidation;
