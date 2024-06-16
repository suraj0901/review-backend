import { DataTypes, Model } from "sequelize";
import { TOKEN } from "./token.enum";
import db from "../config/db";
import User from "../user/user.model";
import { compareSync, hashSync } from "bcryptjs";

class Token extends Model {
  compare_token(value) {
    compareSync(value, this.token);
  }
}

Token.init(
  {
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      set(value) {
        const hashed_token = hashSync(value, 10);
        this.set("token", hashed_token);
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(TOKEN),
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
