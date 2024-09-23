import { PERMISSION } from "../../config/role.enum.js";
import { authorize } from "../../middleware/authentication.js";
import Validate from "../../middleware/validate.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import catchAsync from "../../utils/catchAsync.js";
import ReviewController from "./review.controller.js";
import { ReviewModel } from "./review.model.js";
import ReviewService from "./review.service.js";
import ReviewValidation from "./review.validation.js";

export const reviewService = new ReviewService(ReviewModel, "review");

export const reviewController = new ReviewController(reviewService);

export const review_router = create_basic_router(
  (review_router) => {
    review_router.get(
      "/my-reviews",
      authorize([PERMISSION.GET_REVIEW]),
      catchAsync(reviewController.getMyReviews)
    );
    review_router.get(
      "/to-reviews",
      authorize([PERMISSION.GET_REVIEW]),
      catchAsync(reviewController.getAllReviewsAsReviewers)
    );
    review_router.get(
      "/my-review/:review_id",
      authorize([PERMISSION.GET_REVIEW]),
      catchAsync(reviewController.getMyReview)
    );
    review_router.get(
      "/to-review/:review_id",
      authorize([PERMISSION.GET_REVIEW]),
      catchAsync(reviewController.getToReview)
    );
    return reviewController;
  },
  {
    get: [
      authorize([PERMISSION.MANAGE_REVIEW]),
      Validate(ReviewValidation.getReviews),
    ],
    getById: [
      authorize([PERMISSION.MANAGE_REVIEW]),
      Validate(ReviewValidation.getReview),
    ],
    post: [
      authorize([PERMISSION.MANAGE_REVIEW]),
      Validate(ReviewValidation.createReview),
    ],
    put: [
      authorize([PERMISSION.MANAGE_REVIEW]),
      Validate(ReviewValidation.updateReview),
    ],
    delete: [
      authorize([PERMISSION.MANAGE_REVIEW]),
      Validate(ReviewValidation.deleteReview),
    ],
  }
);
