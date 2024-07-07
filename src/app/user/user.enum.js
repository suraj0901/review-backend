export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const PERMISSION = {
  GET_USER: "GET_USER",
  MANAGE_USER: "MANAGE_USER",
};

export const ROLES_PERMISSION = {
  [ROLES.USER]: [],
  [ROLES.ADMIN]: [PERMISSION.GET_USER, PERMISSION.MANAGE_USER],
};

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};
