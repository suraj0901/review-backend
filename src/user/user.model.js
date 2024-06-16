import { DataTypes, Model, Op } from "sequelize";
import db from "../config/db.js";
import { ROLES } from "./user.enum.js";
import bcryptjs from "bcryptjs";
import paginationUtil from "../utils/paginationUtil.js";
import validator from "validator";

class User extends Model {
  compare_passowrd(value) {
    return bcryptjs.compareSync(value, this.password);
  }
  static async paginate(filter, options) {
    const queryOptions = paginationUtil(filter, options);
    console.log({ queryOptions });
    return this.findAndCountAll(queryOptions);
  }

  static async isEmailTaken(email, exclude_user_id) {
    const user = await this.findOne({
      email,
      where: {
        id: {
          [Op.ne]: exclude_user_id,
        },
      },
    });
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
