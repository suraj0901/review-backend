import { config } from "dotenv";
import { join } from "path";
import joi from "joi";

config({ path: join(import.meta.dirname, "../../.env") });

const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid("production", "development", "test")
      .required(),
    PORT: joi.number().default(3000),
    JWT_SECRET: joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: joi
      .number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: joi
      .number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: joi
      .number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: joi
      .number()
      .default(10)
      .description("minutes after which verify email token expires"),
    SMTP_HOST: joi.string().description("server that will send the emails"),
    SMTP_PORT: joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: joi.string().description("username for email server"),
    SMTP_PASSWORD: joi.string().description("password for email server"),
    EMAIL_FROM: joi
      .string()
      .description("the from field in the emails sent by the app"),
    RESET_PASSWORD_URL: joi.string().description("reset password url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = envVars.NODE_ENV;
export const port = envVars.PORT;
export const jwt = {
  secret: envVars.JWT_SECRET,
  accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
  verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
};

export const email = {
  smtp: {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT,
    auth: {
      user: envVars.SMTP_USERNAME,
      pass: envVars.SMTP_PASSWORD,
    },
  },
  from: envVars.EMAIL_FROM,
  resetPasswordUrl: envVars.RESET_PASSWORD_URL,
  verifyEmailUrl: envVars.RESET_PASSWORD_URL,
};

export const resetPasswordText = (resetPasswordUrl) => `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;

export const verifyPasswordText = (verifyPasswordUrl) => `Dear user,
To verify your email, click on this link: ${verifyPasswordUrl}
If you did not create an account, then ignore this email.`;
