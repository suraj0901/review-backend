import { Op } from "sequelize";
import { PERMISSION } from "../../config/role.enum.js";
import { authenticate } from "../../middleware/authentication.js";
import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { BaseService } from "../../utils/BaseService.js";
import { AnswerService } from "../answer/answer.route.js";
import { ReviewModel } from "../review/review.model.js";
import { FeedbackModel } from "./feedback.model.js";
import { UserModel } from "../user/user.model.js";

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
  create(userId, feedback) {
    this.isAuthorized(userId, feedback);
    return super.create(feedback);
  }
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
  async create(request, response) {
    const feedback = request.body;
    const userId = request?.user?.id;
    await this.service.create(userId, feedback);
    response.status(httpStatus.CREATED).send();
  }

  /**
   * Update a feedback
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  async update(request, response) {
    const feedback = request.body;
    const userId = request?.user?.id;
    await this.service.update(userId, feedback);
    response.status(httpStatus.OK).send();
  }
}

export const FeedbackController = new _FeedbackController(FeedbackService);
export const feedback_router = create_basic_router(FeedbackController, {
  get: [authenticate()],
  getById: [authenticate()],
  delete: [authenticate()],
  put: [authenticate([PERMISSION.MANAGE_FEEDBACK])],
  delete: [authenticate([PERMISSION.MANAGE_FEEDBACK])],
});
