import { Op } from "sequelize";
import { PERMISSION } from "../../config/role.enum.js";
import { authenticate, authorize } from "../../middleware/authentication.js";
import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { BaseService } from "../../utils/BaseService.js";
import { AnswerService } from "../answer/answer.route.js";
import { ReviewModel } from "../review/review.model.js";
import { FeedbackModel } from "./feedback.model.js";
import { UserModel } from "../user/user.model.js";
import Validate from "../../middleware/validate.js";
import FeedbackValidation from "./feedback.validation.js";
import httpStatus from "http-status";

class _FeedbackService extends BaseService {
  constructor(model, name) {
    super(model, name);
  }

  async isAuthorized(user_id, feedback) {
    const answer = await AnswerService.resource.findByPk(feedback.answerId, {
      include: [
        {
          model: ReviewModel,
          include: [
            {
              model: UserModel,
              as: "Reviewers",
              where: {
                id: user_id,
              },
              required: true,
            },
          ],
        },
      ],
    });

    if (!answer) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to give feedback for this answer."
      );
    }
  }
  /**
   * Create a feedback
   * @param {number} userId
   * @param {Object} feedback
   */
  create = async (userId, feedback) => {
    await this.isAuthorized(userId, feedback);
    const payload = {
      title: feedback.title,
      AnswerId: feedback.answerId,
      UserId: userId,
    };
    return super.create(payload);
  };

  /**
   * Update a feedback
   * @param {number} userId
   * @param {Object} feedback
   */
  updateById = async (userId, feedback) => {
    await this.isAuthorized(userId, feedback);
    const payload = {
      title: feedback.title,
      AnswerId: feedback.answerId,
      UserId: userId,
    };
    return super.updateById(feedback.feedbackId, payload);
  };
}

export const FeedbackService = new _FeedbackService(FeedbackModel, "feedback");

class _FeedbackController extends BaseController {
  constructor(service) {
    super(service);
  }

  /**
   * Create a feedback
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  create = async (request, response) => {
    const feedback = request.body;
    const userId = request?.user?.id;
    await this.service.create(userId, feedback);
    response.status(httpStatus.CREATED).send();
  };

  /**
   * Update a feedback
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  update = async (request, response) => {
    const feedback = request.body;
    const userId = request?.user?.id;
    const feedbackId = request.params?.feedback_id;
    await this.service.updateById(userId, { ...feedback, feedbackId });
    response.status(httpStatus.OK).send();
  };
}

export const FeedbackController = new _FeedbackController(FeedbackService);
export const feedback_router = create_basic_router(FeedbackController, {
  get: [authorize([])],
  getById: [authorize([])],
  delete: [authorize([])],
  put: [
    authorize([PERMISSION.MANAGE_FEEDBACK]),
    Validate(FeedbackValidation.update),
  ],
  post: [
    authorize([PERMISSION.MANAGE_FEEDBACK]),
    Validate(FeedbackValidation.create),
  ],
});
