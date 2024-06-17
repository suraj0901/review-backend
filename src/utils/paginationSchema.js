import Joi from "joi";

export default {
  search: Joi.string(),
  sortBy: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
};
