import Joi from "joi";

const AnswerValidation = {
  create: {
    body: Joi.object({
      title: Joi.string().required(),
      ReviewId: Joi.number().required(),
      QuestionId: Joi.number().required(),
    }),
  },
  update: {
    params: Joi.object({
      answer_id: Joi.number().required(),
    }),
    body: {
      title: Joi.string().required(),
      ReviewId: Joi.number().required(),
      QuestionId: Joi.number().required(),
    },
  },
};

export default AnswerValidation;
