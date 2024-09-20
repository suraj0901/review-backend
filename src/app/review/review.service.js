import { db } from "../../config/db.js";
import { BaseService } from "../../utils/BaseService.js";

export default class ReviewService extends BaseService {
  constructor(model, name) {
    super(model, name);
  }

  create(body) {
    let { reviewerIds, ...rest } = body;
    db.transaction(async () => {
      const review = await super.create(rest);
      await review.addReviewers(reviewerIds);
      return review.dataValues;
    });
  }

  updateById(reviwe_id, body) {
    let { reviewerIds, ...rest } = body;
    db.transaction(async () => {
      const review = await super.updateById(reviwe_id, rest);
      await review.setReviewers(reviewerIds);
    });
  }
}
