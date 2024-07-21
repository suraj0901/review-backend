import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { BaseService } from "../../utils/BaseService.js";
import { FeedbackModel } from "./feedback.model.js";

export const FeedbackService = new BaseService(FeedbackModel, "feedback");
export const FeedbackController = new BaseController(FeedbackService);
export const feedback_router = create_basic_router(FeedbackController);
