import { DataTypes, Model } from "sequelize";
import { UserModel } from "../user/user.model.js";
import { db } from "../../config/db.js";
import { ReviewTemplateModel } from "../review_template/review_template.model.js";

export class ReviewModel extends Model {}

ReviewModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Review",
  }
);

ReviewModel.hasOne(UserModel, { as: "Reviewee" });
ReviewModel.hasMany(UserModel, { as: "Reviewer" });

ReviewModel.belongsTo(ReviewTemplateModel);
ReviewTemplateModel.hasMany(ReviewModel);
