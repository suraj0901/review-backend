import { BaseService } from "../../utils/BaseService.js";
import { create_basic_router } from "../../utils/BaseRoute.js";
import { BaseController } from "../../utils/BaseController.js";
import { QuestionModel } from "./question.model.js";

export const QuestionService = new BaseService(QuestionModel, "Question");
export const QuestionController = new BaseController(QuestionService);

export const question_router = create_basic_router(QuestionController);
