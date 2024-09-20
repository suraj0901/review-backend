import Joi from "joi";
import optionSchema from "../../utils/optionSchema.js";
import paginationSchema from "../../utils/paginationSchema.js";

const ReviewValidation = {
  createReview: {
    query: Joi.object(optionSchema),
    body: Joi.object({
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      revieweeId: Joi.number().required(),
      reviewTemplateId: Joi.number().required(),
      reviewerIds: Joi.array().items(Joi.number()).required(),
    }),
  },
  getReviews: {
    query: Joi.object({
      ...paginationSchema,
      ...optionSchema,
    }),
  },
  getReview: {
    params: Joi.object({
      review_id: Joi.number().required(),
    }),
    query: Joi.object(optionSchema),
  },
  updateReview: {
    params: Joi.object({
      review_id: Joi.number().required(),
    }),
    body: {
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
      revieweeId: Joi.number().optional(),
      reviewTemplateId: Joi.number().optional(),
      reviewerIds: Joi.array().items(Joi.number()).required(),
    },
    query: Joi.object(optionSchema),
  },
  deleteReview: {
    params: Joi.object({
      review_id: Joi.number().required(),
    }),
  },
};

export default ReviewValidation;
