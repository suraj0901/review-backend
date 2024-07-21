import { DataTypes, Model } from "sequelize";
import { db } from "../../config/index.js";
import { QuestionModel } from "../question/index.js";

export class ReviewTemplateModel extends Model {}

ReviewTemplateModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 40],
      },
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: "ReviewTemplate",
  }
);

ReviewTemplateModel.hasMany(QuestionModel);
QuestionModel.belongsTo(ReviewTemplateModel);
