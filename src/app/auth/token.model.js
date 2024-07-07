import { DataTypes, Model } from "sequelize";
import { TOKEN_TYPE } from "./token.enum.js";
import db from "../../config/db.js";
import User from "../user/user.model.js";
import becrypt from "bcryptjs";

const { compareSync, hashSync } = becrypt;

class Token extends Model {
  // compare_token(value) {
  //   return compareSync(value, this.token);
  // }
}

Token.init(
  {
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      // set(value) {
      //   const hashed_token = hashSync(value, 10);
      //   this.setDataValue("token", hashed_token);
      // },
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(TOKEN_TYPE),
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "Token" }
);

Token.belongsTo(User);

export default Token;
