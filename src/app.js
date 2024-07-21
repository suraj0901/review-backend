import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import httpStatus from "http-status";
import xss from "xss-clean";
import auth_router from "./app/auth/auth.route.js";
import user_router from "./app/user/user.route.js";
import { env } from "./config/env.js";
import * as morgan from "./config/morgon.js";
import corsOriginOption from "./middleware/corsOriginOption.js";
import { errorConverter, errorHandler } from "./middleware/error.js";
import authLimiter from "./middleware/ratelimiter.js";
import ApiError from "./utils/ApiError.js";
import { question_router } from "./app/question/question.route.js";
import { review_template_router } from "./app/review_template/review_template.route.js";
import { feedback_router } from "./app/feedback/feedback.route.js";
import { review_router } from "./app/review/review.route.js";

const app = express();
// const upload = multer();

if (env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// app.use(upload.any());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse json request body
app.use(express.json());

app.use(cookieParser());

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    origin: corsOriginOption,
  })
);

app.options("*", cors());

// limit repeated failed requests to auth endpoints
if (env === "production") {
  app.use("/v1/auth", authLimiter);
}

app.get("/hello", (_req, res) => {
  res.send("Hello world");
});

app.use("/auth", auth_router);
app.use("/feedback", feedback_router);
app.use("/question", question_router);
app.use("/review", review_router);
app.use("/review_template", review_template_router);
app.use("/user", user_router);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
