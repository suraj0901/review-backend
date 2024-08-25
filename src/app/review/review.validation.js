import Joi from "joi";
import optionSchema from "../../utils/optionSchema.js";
import paginationSchema from "../../utils/paginationSchema.js";

const ReviewValidation = {
  createReviewTemplate: {
    query: Joi.object(optionSchema),
    body: Joi.object({
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      revieweeId: Joi.number().required(),
      reviewTemplateId: Joi.number().required(),
      // reviewerIds: Joi.array().of.required(),
    }),
  },
  getReviewTemplates: {
    query: Joi.object({
      ...paginationSchema,
      ...optionSchema,
    }),
  },
  getReviewTemplate: {
    params: Joi.object({
      review_id: Joi.number().required(),
    }),
    query: Joi.object(optionSchema),
  },
  updateReviewTemplate: {
    params: Joi.object({
      review_id: Joi.number().required(),
    }),
    body: {
      start_date: Joi.date().optional(),
      end_date: Joi.date().optional(),
      revieweeId: Joi.number().optional(),
      reviewTemplateId: Joi.number().optional(),
      // reviewerIds: Joi.array(Joi.number()).optional(),
    },
    query: Joi.object(optionSchema),
  },
  deleteReviewTemplate: {
    params: Joi.object({
      review_id: Joi.number().required(),
    }),
  },
};

export default ReviewValidation;
