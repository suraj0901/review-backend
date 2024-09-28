import Joi from "joi";

const FeedbackValidation = {
  create: {
    body: Joi.object({
      answerId: Joi.number().required(),
      title: Joi.string().required(),
    }),
  },
  update: {
    params: Joi.object({
      feedback_id: Joi.number().required(),
    }),
    body: Joi.object({
      answerId: Joi.number().required(),
      title: Joi.string().required(),
    }),
  },
};

export default FeedbackValidation;
