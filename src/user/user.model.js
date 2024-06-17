import { DataTypes, Model, Op } from "sequelize";
import db from "../config/db.js";
import { ROLES } from "./user.enum.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

class User extends Model {
  compare_passowrd(value) {
    return bcryptjs.compareSync(value, this.password);
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
    console.log({ user });
    return !!user;
  }
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
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
        console.log({ value });
        const hashed_password = bcryptjs.hashSync(value, 10);
        this.setDataValue("password", hashed_password);
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: Object.values(ROLES),
      defaultValue: ROLES.USER,
    },
  },
  {
    sequelize: db,
    modelName: "User",
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
  }
);

export default User;
