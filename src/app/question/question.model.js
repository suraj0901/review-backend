import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";

export class QuestionModel extends Model {}

QuestionModel.init(
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
    modelName: "Question",
  }
);
