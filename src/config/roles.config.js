const allRoles = {
  superAdmin: ['*'],
  admin: [],
  employee: [],
  client: [],
  vendor: [],
  user: [],
};

export const roles = Object.keys(allRoles);

export const roleRights = new Map(Object.entries(allRoles));
