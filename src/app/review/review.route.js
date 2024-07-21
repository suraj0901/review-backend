import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { BaseService } from "../../utils/BaseService.js";
import { ReviewModel } from "./review.model.js";

export const ReviewService = new BaseService(ReviewModel, "review");

export const ReviewController = new BaseController(ReviewService);

export const review_router = create_basic_router(ReviewController);
