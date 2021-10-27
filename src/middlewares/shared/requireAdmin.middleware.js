import { ApplicationError } from '../../errors';

export const requireAdmin = (req, res, next) => {
  if (req.currentUser?.role !== 'admin') {
    throw new ApplicationError(401, 'You are not admin');
  }
  next();
};
