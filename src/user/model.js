import { DataTypes, Model } from "sequelize";
import db from "../config/db.js";
import { ROLES } from "../config/roles.js";
import bcryptjs from "bcryptjs";

class User extends Model {
  compare_passowrd(value) {
    bcryptjs.compareSync(value, this.password);
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
        len: [8, 20],
        isPassword(value) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error(
              "Password must contain at least one letter and one number"
            );
          }
        },
      },
      set(value) {
        const hashed_password = bcryptjs.hashSync(value, 10);
        this.setDataValue(hashed_password);
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: Object.values(ROLES),
      defaultValue: ROLES.USER,
    },
  },
  { sequelize: db, modelName: "User" }
);

export default User;
