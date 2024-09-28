export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const PERMISSION = {
  GET_USER: "GET_USER",
  MANAGE_USER: "MANAGE_USER",
  UPDATE_USER: "UPDATE_USER",
  GET_REVIEW: "GET_REVIEW",
  MANAGE_REVIEW: "MANAGE_REVIEW",
  MANAGE_QUESTIONS: "MANAGE_QUESTIONS",
  MANAGE_FEEDBACK: "MANAGE_FEEDBACK",
  MANAGE_REVIEW_TEMPLATE: "MANAGE_REVIEW_TEMPLATE",
  GET_REVIEW_TEMPLATE: "GET_REVIEW_TEMPLATE",
  GET_ANSWER: "GET_ANSWER",
  MANAGE_ANSWER: "MANAGE_ANSWER",
};

export const ROLES_PERMISSION = {
  [ROLES.USER]: [
    PERMISSION.GET_REVIEW,
    PERMISSION.GET_USER,
    PERMISSION.MANAGE_FEEDBACK,
    PERMISSION.MANAGE_ANSWER,
    PERMISSION.UPDATE_USER,
  ],
  [ROLES.ADMIN]: [
    PERMISSION.GET_USER,
    PERMISSION.MANAGE_USER,
    PERMISSION.MANAGE_REVIEW,
    PERMISSION.UPDATE_USER,
    PERMISSION.MANAGE_QUESTIONS,
    PERMISSION.MANAGE_REVIEW_TEMPLATE,
  ],
};

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};
