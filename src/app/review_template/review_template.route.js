import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { BaseService } from "../../utils/BaseService.js";
import { ReviewTemplateModel } from "./review_template.model.js";

export const ReviewTemplateService = new BaseService(
  ReviewTemplateModel,
  "review_template"
);

export const ReviewTemplateController = new BaseController(
  ReviewTemplateService
);

export const review_template_router = create_basic_router(
  ReviewTemplateController
);
