import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";
import { ReviewModel } from "../review/review.model.js";
import { QuestionModel } from "../question/question.model.js";
import { FeedbackModel } from "../feedback/feedback.model.js";

export class AnswerModel extends Model {}

AnswerModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Answer",
  }
);

AnswerModel.belongsTo(ReviewModel);
ReviewModel.hasMany(AnswerModel);

AnswerModel.belongsTo(QuestionModel);
QuestionModel.hasMany(AnswerModel);

AnswerModel.hasMany(FeedbackModel);
FeedbackModel.belongsTo(AnswerModel);
