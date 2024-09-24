import httpStatus from "http-status";
import { PERMISSION } from "../../config/role.enum.js";
import { authorize } from "../../middleware/authentication.js";
import Validate from "../../middleware/validate.js";
import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { AnswerModel } from "./answer.model.js";
import _AnswerService from "./answer.service.js";
import AnswerValidation from "./answer.validation.js";

export const AnswerService = new _AnswerService(AnswerModel, "answer");

class _AnswerController extends BaseController {
  /**
   * @param {_AnswerService} service
   */
  constructor(service) {
    super(service);
  }

  /**
   * Create Answers in bulk
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  createBulk = async (request, response) => {
    const user_id = request.user.id;
    const resource = await this.service.createBulk(user_id, request.body);
    response.status(httpStatus.CREATED).send(resource);
  };

  /**
   * Update Answers in bulk
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   */
  updateBulk = async (request, response) => {
    const user_id = request.user.id;
    const resource = await this.service.updateBulk(user_id, request.body);
    response.status(httpStatus.OK).send(resource);
  };
}

export const AnswerController = new _AnswerController(AnswerService);

export const answer_router = create_basic_router(
  (router) => {
    router
      .route("/")
      .post(
        [
          authorize([PERMISSION.MANAGE_ANSWER]),
          Validate(AnswerValidation.create),
        ],
        AnswerController.createBulk
      )
      .put(
        [
          authorize([PERMISSION.MANAGE_ANSWER]),
          Validate(AnswerValidation.update),
        ],
        AnswerController.updateBulk
      );
    return AnswerController;
  },
  {
    all: [authorize([])],
  }
);
