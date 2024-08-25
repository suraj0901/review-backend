import Joi from "joi";
import optionSchema from "../../utils/optionSchema.js";
import paginationSchema from "../../utils/paginationSchema.js";

const ReviewTemplateValidation = {
  createReviewTemplate: {
    query: Joi.object(optionSchema),
    body: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      questions: Joi.array().items({
        title: Joi.string().required(),
        id: Joi.string().optional().allow(null),
      }),
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
      review_template_id: Joi.number().required(),
    }),
    query: Joi.object(optionSchema),
  },
  updateReviewTemplate: {
    params: Joi.object({
      review_template_id: Joi.number().required(),
    }),
    body: {
      title: Joi.string().optional(),
      description: Joi.string().optional(),
      questions: Joi.array()
        .items({
          id: Joi.number().allow(null),
          title: Joi.string(),
        })
        .optional(),
      delete_questions_id: Joi.array().items(Joi.number()).optional(),
    },
    query: Joi.object(optionSchema),
  },
  deleteReviewTemplate: {
    params: Joi.object({
      review_template_id: Joi.number().required(),
    }),
  },
};

export default ReviewTemplateValidation;
