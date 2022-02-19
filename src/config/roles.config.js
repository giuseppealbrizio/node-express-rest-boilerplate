const allRoles = {
  superAdmin: ['*', 'getUsers'],
  admin: ['getUsers'],
  employee: ['getUsers'],
  client: ['getUsers'],
  vendor: ['getUsers'],
  user: ['getUsers'],
};

export const roles = Object.keys(allRoles);

export const roleRights = new Map(Object.entries(allRoles));
