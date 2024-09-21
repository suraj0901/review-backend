import { PERMISSION } from "../../config/role.enum.js";
import { authorize } from "../../middleware/authentication.js";
import Validate from "../../middleware/validate.js";
import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import catchAsync from "../../utils/catchAsync.js";
import paginationUtil from "../../utils/paginationUtil.js";
import parseOptions from "../../utils/parseOptions.js";
import pick from "../../utils/pick.js";
import { FeedbackModel } from "../feedback/feedback.model.js";
import { QuestionModel } from "../question/question.model.js";
import { ReviewTemplateModel } from "../review_template/review_template.model.js";
import { UserModel } from "../user/user.model.js";
import { ReviewModel } from "./review.model.js";
import ReviewService from "./review.service.js";
import ReviewValidation from "./review.validation.js";

export const reviewService = new ReviewService(ReviewModel, "review");

class _ReviewController extends BaseController {
  constructor(service) {
    super(service);
  }
  /**
   * Get My Reveiew
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  getMyReview = async (request, response) => {
    const options = pick(request.query, ["select", "exclude", "populate"]);

    const { attributes, include } = parseOptions(options);
    const result = await this.service.resource.findByPk(
      request.params[`${this.service.name}_id`],
      {
        attributes,
        where: {
          reviewerId: request.user.id,
        },
        include: [
          ...include,
          {
            model: ReviewTemplateModel,
            as: "reviewTemplate",
            include: [
              {
                model: QuestionModel,
                include: [
                  {
                    model: FeedbackModel,
                  },
                ],
              },
            ],
          },
        ],
      }
    );
    response.send(result);
  };
  /**
   * Get To Reveiew
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  getToReview = async (request, response) => {
    const options = pick(request.query, ["select", "exclude", "populate"]);

    const { attributes, include } = parseOptions(options);
    const result = await this.service.resource.findByPk(
      request.params[`${this.service.name}_id`],
      {
        attributes,
        include: [
          ...include,
          {
            model: UserModel,
            as: "Reviewers",
            through: {
              where: {
                userId: request.user.id,
              },
            },
            required: true,
          },
          {
            model: ReviewTemplateModel,
            as: "reviewTemplate",
            include: [
              {
                model: QuestionModel,
                include: [
                  {
                    model: FeedbackModel,
                  },
                ],
              },
            ],
          },
        ],
      }
    );
    response.send(result);
  };
  /**
   * Get Reveiew assigned to me as reviewee
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  getMyReviews = async (request, response) => {
    const options = pick(request.query, [
      "sortBy",
      "limit",
      "page",
      "select",
      "search",
      "exclude",
      "searchFields",
      "populate",
    ]);
    if (request.query.filter) {
      request.query.filter += `,revieweeId:${request.user.id}`;
    } else {
      request.query.filter = `revieweeId:${request.user.id}`;
    }
    const result = await this.service.query(request.query.filter, options);
    response.send(result);
  };
  /**
   * Get all reviews assigned to me as reviewers
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  getAllReviewsAsReviewers = async (request, response) => {
    const options = pick(request.query, [
      "sortBy",
      "limit",
      "page",
      "select",
      "search",
      "exclude",
      "searchFields",
      "populate",
    ]);
    const queryOptions = paginationUtil(request.query.filter, options);
    const { attributes, include } = parseOptions(options);

    const result = await this.service.resource.findAndCountAll({
      ...queryOptions,
      attributes,
      include: [
        ...include,
        {
          model: UserModel,
          as: "Reviewers",
          through: {
            where: {
              userId: request.user.id,
            },
          },
          required: true,
        },
      ],
    });
    response.send(result);
  };
}

export const ReviewController = new _ReviewController(reviewService);

export const review_router = create_basic_router(
  (review_router) => {
    review_router.get(
      "/my-reviews",
      authorize([PERMISSION.GET_REVIEW]),
      catchAsync(ReviewController.getMyReviews)
    );
    review_router.get(
      "/to-review",
      authorize([PERMISSION.GET_REVIEW]),
      catchAsync(ReviewController.getAllReviewsAsReviewers)
    );
    review_router.get(
      "/my-review",
      authorize([PERMISSION.GET_REVIEW]),
      catchAsync(ReviewController.getMyReview)
    );
    return ReviewController;
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

// review_router.get(
//   "/my-reviews",
//   authorize([PERMISSION.GET_REVIEW]),
//   catchAsync(ReviewController.getMyReviews)
// );
// review_router.get(
//   "/all-reviews",
//   authorize([PERMISSION.GET_REVIEW]),
//   catchAsync(ReviewController.getAllReviewsAsReviewers)
// );
