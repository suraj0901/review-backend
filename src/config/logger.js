import {
  format as _format,
  createLogger,
  transports as _transports,
} from "winston";
import { env } from "./env.js";

const enumerateErrorFormat = _format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger = createLogger({
  level: env === "development" ? "debug" : "info",
  format: _format.combine(
    enumerateErrorFormat(),
    env === "development" ? _format.colorize() : _format.uncolorize(),
    _format.splat(),
    _format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new _transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});
