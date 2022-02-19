import debug from 'debug';
import _ from 'lodash';
import UserService from '../services/user.service';
import { ApplicationError } from '../errors';

const DEBUG = debug('dev');

const {
  // Admin
  createUser,
  findUsers,
  findUserById,
  findUserAndUpdate,
  findUserAndSoftDelete,

  // Super admin
  findUserAndUpdatePassword,
  findUserAndHardDelete,
} = UserService;

export default {
  createUser: async (req, res) => {
    try {
      const user = await createUser(req.body, req.file);

      res.status(200).json({
        status: 'success',
        message: 'User created successfully',
        data: { user },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },
  /**
   * Find all user accounts.
   * We use composeObject to compose an object of filters
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  getAllUsers: async (req, res) => {
    try {
      const filter = _.pick(req.query, [
        'q', // RegExp in service to search for username
        'active',
        'deleted',
        'username', // RegExp in service to search for username
        'email', // RegExp in service to search for email
        'role',
        'createdAt',
        'updatedAt',
      ]);

      const options = _.pick(req.query, [
        'sortBy',
        'sort',
        'sortColumn',
        'page',
        'perPage',
      ]);

      const results = await findUsers(filter, options);

      res.status(200).json({
        status: 'success',
        message: 'Users successfully retrieved',
        results: results.totalCount,
        paginatedResults: Object.keys(results.users).length,
        data: { users: results.users },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },
  /**
   * Find User by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  getUserById: async (req, res) => {
    try {
      const user = await findUserById(req.params.userId);
      res.status(200).json({
        status: 'success',
        message: 'User by id successfully retrieved',
        data: { user },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },
  /**
   * Update user basic infos by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  updateUser: async (req, res) => {
    try {
      const user = await findUserAndUpdate(
        req.params.userId,
        req.body,
        req.file,
      );

      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },
  /**
   * Update user role cause only super-admin can do
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  softDeleteUserById: async (req, res) => {
    try {
      const user = await findUserAndSoftDelete(
        req.params.userId,
        req.body,
        req.currentUser,
      );

      res.status(200).json({
        status: 'success',
        message: 'User status updated successfully',
        data: { user },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },

  /**
   * SUPER ADMIN CONTROLLER - Feature Flags
   */
  /**
   * Update user password
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  updateUserPassword: async (req, res) => {
    try {
      const user = await findUserAndUpdatePassword(
        req.params.userId,
        req.body,
        req.currentUser,
      );

      res.status(200).json({
        status: 'success',
        message: 'User password was updated successfully',
        data: { user },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },
  /**
   * Delete user by id
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  hardDeleteUserById: async (req, res) => {
    try {
      const user = await findUserAndHardDelete(
        req.params.userId,
        req.currentUser,
      );

      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
        data: { user },
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },
};
