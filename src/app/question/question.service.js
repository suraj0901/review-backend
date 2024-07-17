import BaseService from "../../utils/BaseService";
import Question from "./question.model";

const QuestionService = new BaseService(Question, "Question");

export default QuestionService;
