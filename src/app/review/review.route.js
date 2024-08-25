import Validate from "../../middleware/validate.js";
import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import ReviewService from "./review.service.js";
import ReviewValidation from "./review.validation.js";

export const reviewService = new ReviewService();

export const ReviewController = new BaseController(reviewService);

export const review_router = create_basic_router(ReviewController, {
  get: [Validate(ReviewValidation.getReviews)],
  post: [Validate(ReviewValidation.createReview)],
  getById: [Validate(ReviewValidation.getReview)],
  put: [Validate(ReviewValidation.updateReview)],
  delete: [Validate(ReviewValidation.deleteReview)],
});
