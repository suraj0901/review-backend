import { Router } from "express";
import BaseController from "./BaseController.js";
import catchAsync from "./catchAsync.js";

/**
 * @param {BaseController} Controller
 */
export function create_basic_router(Controller, option) {
  const default_router = Router();

  default_router
    .route("/")
    .get(option?.all, option?.get, catchAsync(Controller.getAll))
    .post(option?.all, option?.post, catchAsync(Controller.create));

  default_router
    .route(`/:${Controller.service.name}`)
    .get(option.all, option.getById, catchAsync(Controller.get))
    .put(option.all, option.put, catchAsync(Controller.update))
    .delete(option.all, option.delete, catchAsync(Controller.delete));
  return default_router;
}
