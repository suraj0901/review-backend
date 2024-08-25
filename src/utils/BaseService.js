import httpStatus from "http-status";
import ApiError from "./ApiError.js";
import paginationUtil from "./paginationUtil.js";
import parseOptions from "./parseOptions.js";
import { Model } from "sequelize";

class BaseModel extends Model {}

export class BaseService {
  /**
   * @param {typeof BaseModel} resource - Resource
   * @param {string} [name="Resource"]
   */
  constructor(resource, name = "Resource") {
    this.resource = resource;
    this.name = name;
  }

  /**
   * Create a resource
   * @param {Object} body - resource body
   * @param {Object} options - resource body
   */
  async create(body) {
    let resource = null;
    if (Array.isArray(body)) {
      resource = await this.resource.bulkCreate(body);
    } else resource = await this.resource.create(body);
    return resource;
  }

  /**
   * Query for users
   * @param {Object} filter - Filter by field
   * @param {Object} options - Query options
   * @param {string} [options.sortBy]
   * @param {number} [options.limit]
   * @param {number} [options.page]
   */
  async query(filter, options) {
    const queryOptions = paginationUtil(filter, options);
    const { attributes, include } = parseOptions(options);
    const users = await this.resource.findAndCountAll({
      ...queryOptions,
      attributes,
      include,
    });
    return users;
  }

  /**
   * Get resource by id
   * @param {number} id
   */
  async getById(id, options) {
    console.log({ id });
    const { attributes, include } = parseOptions(options);
    return this.resource.findByPk(id, {
      attributes,
      include,
    });
  }

  /**
   * Update Resource by id
   * @param {number} reource_Id
   * @param {Object} udpateBody
   * @param {Object} options
   */
  async updateById(reource_Id, udpateBody, options) {
    const resource = await this.getById(reource_Id, options);
    if (!resource) {
      throw new ApiError(httpStatus.NOT_FOUND, `${this.name} not found`);
    }
    Object.assign(resource, udpateBody);
    await resource.save();
    return resource;
  }

  /**
   * Delete resource by id
   * @param {number} resource_Id
   */
  async deleteById(resource_Id) {
    const user = await this.getById(resource_Id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, `${this.name} not found`);
    }
    await user.destroy();
    return user;
  }
}
