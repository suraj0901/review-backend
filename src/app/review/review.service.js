import { db } from "../../config/db.js";
import { BaseService } from "../../utils/BaseService.js";
import { ReviewModel } from "./review.model.js";

export default class ReviewService extends BaseService {
  constructor() {
    super(ReviewModel, "review");
  }

  //   create(body) {
  //     let { reviewerIds, ...rest } = body;
  //     db.transaction(async () => {
  //       const review = await this.resource.create(rest);
  //       await review.addReviews(reviewerIds);
  //       return review.dataValues;
  //     });
  //   }

  //   updateById(reviwe_id, body) {
  //     let { reviewerIds, ...rest } = body;
  //     db.transaction(async () => {
  //       const review = await super.updateById(reviwe_id, rest);
  //     });
  //   }
}
