import { roleRights } from '../config/roles.config';
import { ApplicationError } from '../helpers/errors.helper';

export const verifyRights =
  (...requiredRights) =>
  (req, res, next) => {
    if (requiredRights?.length) {
      const userRights = roleRights.get(req.currentUser?.role);
      // console.log('Required rights: ', requiredRights);
      // console.log('User rights:', userRights);

      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight),
      );

      if (!hasRequiredRights && req.params.userId !== req.currentUser.id) {
        throw new ApplicationError(
          403,
          'You are not authorized to use this endpoint',
        );
      }
    }
    next();
  };

// if (req.currentUser.role !== 'superAdmin') {
//   throw new ApplicationError(403, 'You are not a super admin!');
// }
