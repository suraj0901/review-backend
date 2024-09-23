import paginationUtil from "../../utils/paginationUtil.js";
import parseOptions from "../../utils/parseOptions.js";
import pick from "../../utils/pick.js";
import { AnswerModel } from "../answer/answer.model.js";
import { QuestionModel } from "../question/question.model.js";
import { ReviewTemplateModel } from "../review_template/review_template.model.js";
import { UserModel } from "../user/user.model.js";
import { BaseController } from "../../utils/BaseController.js";

export default class ReviewController extends BaseController {
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
            model: UserModel,
            as: "Reviewers",
          },
          {
            model: AnswerModel,
          },
          {
            model: UserModel,
            as: "Reviewee",
          },
          {
            model: ReviewTemplateModel,
            // as: "reviewTemplate",
            include: [
              {
                model: QuestionModel,
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
            model: AnswerModel,
          },
          {
            model: UserModel,
            as: "Reviewee",
          },
          {
            model: UserModel,
            as: "Reviewers",
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
