import { ApplicationError } from '../../errors';

// eslint-disable-next-line import/prefer-default-export
export const requireAdmin = (req, res, next) => {
  // console.log(req.currentUser);
  if (!req.currentUser?.roleAccess?.admin) {
    throw new ApplicationError(401, 'You are not admin');
  }
  next();
};
