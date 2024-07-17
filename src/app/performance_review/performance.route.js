import { Router } from "express";

const performance_router = Router();

performance_router.route("/").get().post();
performance_router.route("/:performanceId").get().post();

export default performance_router;
