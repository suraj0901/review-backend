import { DataTypes, Model } from "sequelize";
import { db } from "../../config/db.js";
import { UserModel } from "../user/user.model.js";

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

FeedbackModel.belongsTo(UserModel);
UserModel.hasMany(FeedbackModel);
