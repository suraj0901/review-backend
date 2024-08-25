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

// One-to-Many: User as Reviewee
UserModel.hasMany(ReviewModel, {
  as: "ReviewsAsReviewee",
  foreignKey: "revieweeId",
});

ReviewModel.belongsTo(UserModel, {
  as: "Reviewee",
  foreignKey: "revieweeId",
});

// Many-to-Many: Reviewers
ReviewModel.belongsToMany(UserModel, {
  through: "Reviewer",
  as: "Reviewers",
  foreignKey: "reviewId",
});

UserModel.belongsToMany(ReviewModel, {
  through: "Reviewer",
  as: "ReviewsAsReviewer",
  foreignKey: "userId",
});

// A Review_Template can have multiple Reviews
ReviewModel.belongsTo(ReviewTemplateModel, {
  foreignKey: "reviewTemplateId",
});

// A Review_Template can have multiple Reviews
ReviewTemplateModel.hasMany(ReviewModel, {
  foreignKey: "reviewTemplateId",
});
