import nodemailer from "nodemailer";
import {
  email,
  env,
  resetPasswordText,
  verifyPasswordText,
} from "../../config/env.js";
import logger from "../../config/logger.js";

class _EmailService {
  /**@type {typeof import("../../config/env").email} */
  email;
  /**
   * Email service
   * @param {typeof email} email
   * @param {typeof env} env
   */
  constructor(email, env) {
    this.email = email;
    this.transport = nodemailer.createTransport(email.smtp);
    if (env !== "test") {
      this.transport
        .verify()
        .then(() => logger.info("Connected to email server"))
        .catch(() =>
          logger.warn(
            "Unable to connect to email server. Make sure your configured the SMTP options in .env"
          )
        );
    }
  }

  /**
   *
   * @param {string} to
   * @param {string} subject
   * @param {string} text
   */
  async sendEmail(to, subject, text) {
    const msg = { from: this.email.from, to, subject, text };
    await this.transport.sendMail(msg);
  }

  /**
   * Send verification email
   * @param {string} to
   * @param {string} token
   */
  async sendResetPasswordEmail(to, token) {
    const subject = "Reset password";
    const resetPasswordUrl = this.email.resetPasswordUrl + `?token=${token}`;
    const text = resetPasswordText(resetPasswordUrl);
    await this.sendEmail(to, subject, text);
  }

  /**
   * Send verification email
   * @param {string} to
   * @param {string} token
   */
  async sendVerificationEmail(to, token) {
    const subject = "Email verification";
    const verifyEmailUrl = this.email.verifyEmailUrl + `?token=${token}`;
    const text = verifyPasswordText(verifyEmailUrl);
    await this.sendEmail(to, subject, text);
  }
}

const EmailService = new _EmailService(email, env);

export default EmailService;
