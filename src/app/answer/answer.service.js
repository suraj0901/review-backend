import httpStatus from "http-status";
import { BaseService } from "../../utils/BaseService.js";
import { QuestionService } from "../question/question.route.js";
import { reviewService } from "../review/review.route.js";
import ApiError from "../../utils/ApiError.js";

export default class _AnswerService extends BaseService {
  constructor(resource, name) {
    super(resource, name);
  }

  async checkisAuthorized(review_id, question_id, user_id) {
    const review = await reviewService.getById(review_id);
    const question = await QuestionService.getById(question_id);
    if (!review || !question) {
      throw new ApiError(httpStatus.NOT_FOUND, "review or question not found");
    }

    if (
      review.revieweeId !== user_id ||
      review.reviewTemplateId !== question.ReviewTemplateId
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
  }

  async create(user_id, body) {
    let { ReviewId, QuestionId, ...rest } = body;
    await this.checkisAuthorized(ReviewId, QuestionId, user_id);
    const answer = await super.create(rest);
    return answer;
  }

  async updateById(answer_id, body) {
    let { ReviewId, QuestionId } = body;
    await this.checkisAuthorized(ReviewId, QuestionId, user_id);
    const answer = await super.updateById(answer_id, body);
    return answer;
  }
}
