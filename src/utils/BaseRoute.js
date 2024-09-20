import { Router } from "express";
import { BaseController } from "./BaseController.js";
import catchAsync from "./catchAsync.js";

/**
 * @typedef {(req: any, res: any, next: any) => void} Middleware
 * @param {BaseController} Controller
 * @param {{ all?:[Middleware],get?:[Middleware], getById?:[Middleware], post?:[Middleware], put?:[Middleware], delete?:[Middleware]}} middleware
 */
export function create_basic_router(Controller, middleware) {
  const default_router = Router();
  if (typeof Controller === "function") Controller = Controller(default_router);
  default_router
    .route("/")
    .get(
      middleware?.all ?? [],
      middleware?.get ?? [],
      catchAsync(Controller.getAll)
    )
    .post(
      middleware?.all ?? [],
      middleware?.post ?? [],
      catchAsync(Controller.create)
    );
  default_router
    .route(`/:${Controller.service.name}_id`)
    .get(
      middleware?.all ?? [],
      middleware?.getById ?? [],
      catchAsync(Controller.get)
    )
    .put(
      middleware?.all ?? [],
      middleware?.put ?? [],
      catchAsync(Controller.update)
    )
    .delete(
      middleware?.all ?? [],
      middleware?.delete ?? [],
      catchAsync(Controller.delete)
    );
  return default_router;
}
