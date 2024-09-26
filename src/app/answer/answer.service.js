import httpStatus from "http-status";
import { db } from "../../config/index.js";
import ApiError from "../../utils/ApiError.js";
import { BaseService } from "../../utils/BaseService.js";
import { QuestionModel } from "../question/question.model.js";
import { ReviewTemplateModel } from "../review_template/review_template.model.js";
import { UserModel } from "../user/user.model.js";
import { reviewService } from "../review/review.route.js";
import { Op } from "sequelize";

export default class _AnswerService extends BaseService {
  constructor(resource, name) {
    super(resource, name);
  }

  async checkisAuthorized(user_id, body) {
    const provided_question_ids = body.answers.map((item) => item.QuestionId);

    const review = await reviewService.resource.findByPk(body.reviewId, {
      include: [
        {
          model: UserModel,
          as: "Reviewee",
          where: {
            id: user_id,
          },
          required: true,
        },
        {
          model: ReviewTemplateModel,
          include: [
            {
              model: QuestionModel,
              where: {
                id: {
                  [Op.in]: provided_question_ids,
                },
              },
              required: true,
            },
          ],
        },
      ],
    });

    if (!review) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to answer this review or the review does not exist."
      );
    }

    const matchedQuestionIds = review.ReviewTemplate.Questions.map((q) => q.id);

    if (matchedQuestionIds.length !== provided_question_ids.length) {
      // If the number of matched questions is less, some of the provided questionIds are invalid
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Some questions do not belong to the review template."
      );
    }
  }

  async createBulk(user_id, body) {
    await this.checkisAuthorized(user_id, body);
    const answers = body.answers.map((answer) => ({
      ...answer,
      ReviewId: body.reviewId,
    }));
    return await this.resource.bulkCreate(answers);
  }

  async updateBulk(user_id, body) {
    await this.checkisAuthorized(user_id, body);
    const answers = body.answers.map((answer) => ({
      ...answer,
      id: answer.id ?? null,
      ReviewId: body.reviewId,
    }));
    const result = await this.resource.bulkCreate(answers, {
      updateOnDuplicate: ["title"],
    });

    return result;
  }
}
