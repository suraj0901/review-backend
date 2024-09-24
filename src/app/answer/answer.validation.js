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
    params: Joi.object({
      answer_id: Joi.number().required(),
    }),
    body: Joi.object({
      ReviewId: Joi.number().required(),
      answers: Joi.array().items({
        id: Joi.number().required(),
        title: Joi.string().required(),
        QuestionId: Joi.number().required(),
      }),
    }),
  },
};

export default AnswerValidation;
