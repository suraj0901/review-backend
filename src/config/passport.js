import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { TOKEN_TYPE } from "../app/auth/token.enum.js";
import { UserModel } from "../app/user/user.model.js";
import { jwt } from "./env.js";

const jwtOptions = {
  secretOrKey: jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

async function jwtVerify(payload, done) {
  try {
    if (payload.type !== TOKEN_TYPE.ACCESS) {
      throw new Error("Invalid token type");
    }

    return done(null, payload.sub);
  } catch (error) {
    done(payload.sub, false);
  }
}
export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
