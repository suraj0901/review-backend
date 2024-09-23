import { PERMISSION } from "../../config/role.enum.js";
import { authorize } from "../../middleware/authentication.js";
import Validate from "../../middleware/validate.js";
import { BaseController } from "../../utils/BaseController.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { AnswerModel } from "./answer.model.js";
import _AnswerService from "./answer.service.js";
import AnswerValidation from "./answer.validation.js";

export const AnswerService = new _AnswerService(AnswerModel, "answer");

export const AnswerController = new BaseController(AnswerService);

export const answer_router = create_basic_router(AnswerController, {
  get: [authorize([])],
  post: [
    authorize([PERMISSION.MANAGE_ANSWER]),
    Validate(AnswerValidation.create),
  ],
  getById: [authorize([])],
  put: [
    authorize([PERMISSION.MANAGE_ANSWER]),
    Validate(AnswerValidation.update),
  ],
  delete: [authorize([])],
});
