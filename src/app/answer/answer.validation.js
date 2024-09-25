import Joi from "joi";

const AnswerValidation = {
  create: {
    body: Joi.object({
      reviewId: Joi.number().required(),
      answers: Joi.array().items({
        title: Joi.string().required(),
        QuestionId: Joi.number().required(),
      }),
    }),
  },
  update: {
    body: Joi.object({
      reviewId: Joi.number().required(),
      answers: Joi.array().items({
        id: Joi.number().optional().allow(null),
        title: Joi.string().required(),
        QuestionId: Joi.number().required(),
      }),
    }),
  },
};

export default AnswerValidation;
