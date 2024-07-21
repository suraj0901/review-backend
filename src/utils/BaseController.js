import httpStatus from "http-status";
import { BaseService } from "./BaseService.js";
import pick from "./pick.js";
import ApiError from "./ApiError.js";

export class BaseController {
  service;
  /**
   * Service
   * @template T
   * @param {T & BaseService} service
   */
  constructor(service) {
    this.service = service;
  }

  /**
   * Create resource
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  create = async (request, response) => {
    const options = pick(request.query, ["select", "exclude", "populate"]);
    const resource = await this.service.create(request.body, options);
    response.status(httpStatus.CREATED).send(resource);
  };

  /**
   * Get all Resource with options
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  getAll = async (request, response) => {
    const options = pick(request.query, [
      "sortBy",
      "limit",
      "page",
      "select",
      "search",
      "exclude",
      "searchFields",
      "populate",
    ]);
    const result = await this.service.query(request.query.filter, options);
    response.send(result);
  };

  /**
   * Get Resource by id
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  get = async (request, response) => {
    const options = pick(request.query, ["select", "exclude", "populate"]);
    const resource = await this.service.getById(
      request.params[`${this.service.name}_id`],
      options
    );

    if (!resource) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `${this.service.name} not found`
      );
    }
    response.send(resource);
  };

  /**
   * Update Resource by id
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  update = async (request, response) => {
    const options = pick(request.query, ["select", "exclude", "populate"]);

    const resource = await this.service.updateById(
      request.params[`${this.service.name}_id`],
      request.body,
      options
    );
    response.send(resource);
  };

  /**
   * Delete Resource by id
   * @param {import("express").Request} request - Express request
   * @param {import("express").Response} response - Express response
   */
  delete = async (request, response) => {
    await this.service.deleteById(request.params[`${this.service.name}_id`]);
    response.status(httpStatus.NO_CONTENT).send();
  };
}
