import Validate from "../../middleware/validate.js";
import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { ReviewTemplateModel } from "./review_template.model.js";
import ReviewTemplateServiceClass from "./review_template.service.js";
import ReviewTemplateValidation from "./review_template.validation.js";

export const ReviewTemplateService = new ReviewTemplateServiceClass(
  ReviewTemplateModel,
  "review_template"
);

export const ReviewTemplateController = new BaseController(
  ReviewTemplateService
);

export const review_template_router = create_basic_router(
  ReviewTemplateController,
  {
    get: [Validate(ReviewTemplateValidation.getReviewTemplates)],
    post: [Validate(ReviewTemplateValidation.createReviewTemplate)],
    getById: [Validate(ReviewTemplateValidation.getReviewTemplate)],
    put: [Validate(ReviewTemplateValidation.updateReviewTemplate)],
    delete: [Validate(ReviewTemplateValidation.deleteReviewTemplate)],
  }
);
