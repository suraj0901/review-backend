import { DataTypes, Model } from "sequelize";
import { TOKEN_TYPE } from "./token.enum.js";
import { db } from "../../config/db.js";
import { UserModel } from "../user/user.model.js";

class Token extends Model {}

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

Token.belongsTo(UserModel);

export default Token;
