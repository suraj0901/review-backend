import Joi from "joi";

export default {
  select: Joi.string(),
  exclude: Joi.string(),
  populate: Joi.string(),
};
