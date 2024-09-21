import { DataTypes, Model } from "sequelize";
import { QuestionModel } from "../question/index.js";
import { ReviewModel } from "../review/review.model.js";
import { UserModel } from "../user/user.model.js";
import { db } from "../../config/db.js";

export class FeedbackModel extends Model {}

FeedbackModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Feedback",
  }
);

QuestionModel.hasMany(FeedbackModel);
FeedbackModel.belongsTo(QuestionModel);

// ReviewModel.hasMany(FeedbackModel);
// FeedbackModel.belongsTo(ReviewModel);

FeedbackModel.hasOne(UserModel, { as: "Reviewer" });
UserModel.hasMany(FeedbackModel);
