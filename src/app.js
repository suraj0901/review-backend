import express from "express";
import user_router from "./user/route.js";

const app = express();

app.get("/hello", (_req, res) => {
  res.send("Hello world");
});

app.use("/user", user_router);

export default app;
