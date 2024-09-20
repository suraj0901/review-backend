import { DataTypes, Model, Op } from "sequelize";
import { db } from "../../config/index.js";
import { GENDER, ROLES } from "../../config/index.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

export class UserModel extends Model {
  compare_passowrd(value) {
    const isPasswordMatch = bcryptjs.compareSync(value, this.password);
    return isPasswordMatch;
  }

  static async isEmailTaken(email, exclude_user_id) {
    const exclude_options = exclude_user_id
      ? {
          id: {
            [Op.ne]: exclude_user_id,
          },
        }
      : {};
    const user = await this.findOne({
      where: {
        email,
        ...exclude_options,
      },
    });
    return !!user;
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(GENDER)),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        if (this.getDataValue("isEmailVerified"))
          this.setDataValue(
            "isEmailVerified",
            value === this.getDataValue("email")
          );
        this.setDataValue("email", value.trim().toLocaleLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isPassword: validator.isStrongPassword,
      },
      set(value) {
        const hashed_password = bcryptjs.hashSync(value, 10);
        this.setDataValue("password", hashed_password);
      },
    },
    profile_image: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM,
      values: Object.values(ROLES),
      defaultValue: ROLES.USER,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    hooks: {
      afterCreate(user) {
        delete user.dataValues.password;
      },
      afterUpdate(user) {
        delete user.dataValues.password;
      },
    },
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
  }
);

export async function createAdmin() {
  return UserModel.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: "Admin#09",
    gender: GENDER.OTHER,
    role: ROLES.ADMIN,
  });
}
