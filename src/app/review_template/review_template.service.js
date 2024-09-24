import { db } from "../../config/index.js";
import { BaseService } from "../../utils/BaseService.js";
import { QuestionService } from "../question/index.js";

class ReviewTemplateServiceClass extends BaseService {
  constructor(model, name) {
    super(model, name);
  }
  create(body) {
    let { title, description, questions } = body;
    return db.transaction(async () => {
      const review_template = await super.create({ title, description });
      questions = questions.map((item) => ({
        ...item,
        ReviewTemplateId: review_template.id,
      }));
      const Questions = await QuestionService.create(questions);
      return { ...review_template, Questions };
    });
  }

  updateById(id, body) {
    let { title, description, questions, delete_questions_id } = body;
    return db.transaction(async () => {
      const review_template = await super.updateById(id, {
        title,
        description,
      });

      questions = questions.map((item) => ({
        ...item,
        id: item.id ?? null,
        ReviewTemplateId: review_template.id,
      }));

      let Questions;
      if (Array.isArray(questions) && questions.length > 0) {
        Questions = await QuestionService.resource.bulkCreate(questions, {
          updateOnDuplicate: ["title"],
        });
      }

      if (
        Array.isArray(delete_questions_id) &&
        delete_questions_id.length > 0
      ) {
        await QuestionService.resource.destroy({
          where: {
            id: delete_questions_id,
          },
        });
      }
      return { ...review_template, Questions };
    });
  }
}

export default ReviewTemplateServiceClass;
