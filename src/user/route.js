import { Router } from "express";
import User from "./model.js";

const user_router = Router();

user_router.get("/", (_req, res) => {
  User.findAll()
    .then((data) => res.json(data))
    .catch((error) => console.error(error));
});

export default user_router;
