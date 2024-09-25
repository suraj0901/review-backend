import Joi from "joi";

const FeedbackValidation = {
  create: {
    body: Joi.object({
      answerId: Joi.string().required(),
      title: Joi.string().required(),
    }),
  },
  update: {
    params: Joi.object({
      feedbackId: Joi.number().required(),
    }),
    body: Joi.object({
      answerId: Joi.string().required(),
      title: Joi.string().required(),
    }),
  },
};

export default FeedbackValidation;
