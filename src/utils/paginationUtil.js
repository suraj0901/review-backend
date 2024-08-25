import { Op } from "sequelize";

/**
 * Paginate and search with sequelize
 * @param {Object} filter - Filter criteria
 * @param {Object} options - Pagination and search options
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {string} [options.search] - Search term for text search
 * @param {string} [options.searchFields] - Fields to search in, as an array
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 */

export default function paginationUtil(filter, options) {
  const order = options?.sortBy
    ? options.sortBy.split(",").map((sortOption) => {
        const [key, order] = sortOption.split(":");
        return [key, order.toUpperCase()];
      })
    : [["createdAt", "DESC"]];

  const limit =
    options?.limit && parseInt(options.limit, 10) > 0
      ? parseInt(options.limit, 10)
      : 10;
  const page =
    options?.page && parseInt(options.page, 10) > 0
      ? parseInt(options.page, 10)
      : 1;

  const offset = (page - 1) * limit;

  if (filter) {
    filter = filter
      .split(",")
      .map((options) => options.split(":"))
      .reduce((prev, next) => ({ ...prev, [next[0]]: next[1] }), {});
  }
  // If search term is provided, add to filter
  if (options.search && options.searchFields) {
    console.log(options, options.searchFields);
    const searchFields = options.searchFields.split(",");
    const searchCriteria = {
      [Op.or]: searchFields.map((field) => ({
        [field]: {
          [Op.like]: `%${options.search}%`,
        },
      })),
    };
    filter = {
      ...filter,
      ...searchCriteria,
    };
  }

  return {
    where: filter,
    order,
    limit,
    offset,
  };
}
