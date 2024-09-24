import httpStatus from "http-status";
import { db } from "../../config/index.js";
import ApiError from "../../utils/ApiError.js";
import { BaseService } from "../../utils/BaseService.js";
import { QuestionModel } from "../question/question.model.js";
import { reviewService } from "../review/review.route.js";
import { ReviewTemplateModel } from "../review_template/review_template.model.js";
import { UserModel } from "../user/user.model.js";

export default class _AnswerService extends BaseService {
  constructor(resource, name) {
    super(resource, name);
  }

  async checkisAuthorized(user_id, body) {
    const review = await reviewService.resource.findOne({
      where: {
        id: body.reviewId,
      },
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

    const provided_question_ids = new Set(
      body.answers.map((item) => item.QuestionId)
    );

    for (const question of review.ReviewTemplate.Questions) {
      if (provided_question_ids.has(question.id)) continue;
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Some questions do not belong to review template"
      );
    }
  }

  async createBulk(user_id, body) {
    return db.transaction(async () => {
      await this.checkisAuthorized(user_id, body);
      const answers = body.answers.map((answer) => ({
        ...answer,
        ReviewId: body.ReviewId,
      }));
      await this.resource.bulkCreate(answers);
    });
  }

  async updateBulk(user_id, body) {
    return db.transaction(async () => {
      await this.checkisAuthorized(user_id, body);
      const answers = body.answers.map((answer) => ({
        ...answer,
        id: answer.id ?? null,
        ReviewId: body.ReviewId,
      }));
      await this.resource.bulkCreate(answers, {
        updateOnDuplicate: ["title"],
      });
    });
  }
}
