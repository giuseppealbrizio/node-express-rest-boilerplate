import cleanDeep from 'clean-deep';
import User from '../models/user.model';
import { ApplicationError } from '../errors';
import { deleteFileFromGCS, streamFileToGCS } from './upload/upload.service';

/**
 * Filter for users are:
 * @param active,
 * @param deleted,
 * @param username,
 * @param email,
 * @param role,
 * @param createdAt,
 * @param updatedAt
 */

export default {
  /**
   * USER - Related services
   */
  /**
   * Super admin can create user
   * @param body
   * @param file
   * @returns {Promise<void>}
   */
  createUser: async (body, file) => {
    const { fullName, email, password, username, role } = body;

    // Check if a user already exists in the user collection
    const checkEmail = await User.checkExistingField('email', email);

    if (checkEmail) {
      throw new ApplicationError(301, 'User email already exists');
    }

    const checkUsername = await User.checkExistingField('username', username);

    if (checkUsername) {
      throw new ApplicationError(301, 'User username already exists');
    }

    // Create a new User object
    const newUser = new User();

    // If file is provided, upload it to GCS
    if (file) {
      // then recreate a new file from the file object
      const directory = `users/${newUser.id}/profile-pic`;
      const { publicUrl, blobName } = await streamFileToGCS(file, directory);
      newUser.pictureUrl = publicUrl;
      newUser.pictureBlob = blobName;
    }

    // newUser.pictureUrl = file ? file.linkUrl : undefined;
    newUser.fullName = fullName;
    newUser.email = email;
    newUser.username = username;
    newUser.password = password;
    newUser.role = role;

    await newUser.save();

    // Return the new user
    return newUser;
  },
  /**
   * Get all users based on filters
   * @param filter
   * @param options
   * @return {Promise<*>}   */
  findUsers: async (filter, options) => {
    // destructuring options
    const { sort, sortColumn, sortBy, page, perPage } = options;

    // Build a sorting filter based on sort and sortColumn
    const sorting = sort === 'asc' ? sortColumn : `-${sortColumn}`;

    // Build a pagination filter based on  perPage option
    const pagination = perPage ? parseInt(perPage, 10) : 0;

    // PageNumber From which Page to Start
    const pageNumber = page ? parseInt(page, 10) : 1;

    // Create an object from filter
    const reqQuery = {
      ...filter,
      username: {
        $regex: filter.q ? filter.q : '',
        $options: filter.q ? 'i' : '',
      },
      email: {
        $regex: filter.email ? filter.email : '',
        $options: filter.email ? 'i' : '',
      },
    };

    // Clean empty values
    const cleanedFilters = await cleanDeep(reqQuery);

    // Stringify queries
    let queryStr = JSON.stringify(cleanedFilters);

    // Include operators in the query string
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in|eq)\b/g,
      (match) => `$${match}`,
    );

    // Count results with only filters applied for pagination
    const totalCount = await User.countDocuments(JSON.parse(queryStr));

    // Then we return the user based on the filters
    const users = await User.find(JSON.parse(queryStr))
      .sort(sorting || sortBy)
      .skip(pagination * (pageNumber - 1))
      .limit(pagination);

    return {
      totalCount,
      users,
    };
  },
  /**
   * Get a user by id
   * @return {Promise<Document<any, any, unknown>>}
   * @param userId
   */
  findUserById: async (userId) => {
    const user = await User.findById(userId).exec();

    if (user !== null) {
      return user;
    } else {
      throw new ApplicationError(404, 'User not found');
    }
  },
  /**
   * Update basic user info based on the id
   * @param userId
   * @param body
   * @param file
   * @return {Promise<*>}
   */
  findUserAndUpdate: async (userId, body, file) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApplicationError(404, 'User not found');
    }

    // destructuring user
    const { id, pictureBlob } = user;

    // if file is provided, upload it to GCS
    if (file) {
      // if user has a picture blob, delete it from GCS
      if (pictureBlob) {
        await deleteFileFromGCS(pictureBlob);
      }

      const directory = `users/${id}/profile-pic`;
      const { publicUrl, blobName } = await streamFileToGCS(file, directory);

      // 2. Merge the req.body and pic obj created and pass
      const pictureObject = {
        pictureUrl: publicUrl,
        pictureBlob: blobName,
      };

      // 3. Cleaning undefined values and create a cleaned object
      const cleanedObj = await cleanDeep(pictureObject);

      // set the cleaned object to the user
      user.set(cleanedObj);
    }

    // 2. Merge the req.body and pic obj created and pass
    const mergedObject = {
      fullName: body.fullName,
      email: body.email,
      username: body.username,
      role: body.role,
    };

    // 3. Cleaning undefined values and create a cleaned object
    const cleanedObject = await cleanDeep(mergedObject);

    user.set(cleanedObject);

    return user.save();
  },
  /**
   * Soft delete and deactivate user
   * @param userId
   * @param body
   * @param currentUser
   * @return {Promise<*>}
   */
  findUserAndSoftDelete: async (userId, body, currentUser) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApplicationError(404, 'User to soft delete not found!');
    }

    // Check if delete value isn't true or it is
    if (!body.delete) {
      user.active = true;
      await user.restore();
    } else {
      user.active = false;
      await user.delete(currentUser.id);
    }

    return user;
  },

  /**
   * SUPER ADMIN SERVICES - Feature Flags
   */
  /**
   * Update user password only if super admin
   * @param userId
   * @param body
   * @param currentUser
   * @return {Promise<*>}
   */
  findUserAndUpdatePassword: async (userId, body, currentUser) => {
    // Check if current user is a super admin
    if (currentUser.role !== 'superAdmin') {
      throw new ApplicationError(403, 'You are not a super admin!');
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApplicationError(404, 'User to update not found!');
    }

    const mergedObject = {
      password: body.password,
    };

    // 3. Cleaning undefined values and create a cleaned object
    const cleanedObject = await cleanDeep(mergedObject);

    user.set(cleanedObject);

    return user.save();
  },
  /**
   * Delete a used based on the id
   * @param userId
   * @param currentUser
   * @return {Promise<*>}
   */
  findUserAndHardDelete: async (userId, currentUser) => {
    // Check if current user is a super admin
    if (currentUser.role !== 'superAdmin') {
      throw new ApplicationError(403, 'You are not a super admin!');
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    const { pictureBlob } = deletedUser;

    if (pictureBlob) {
      await deleteFileFromGCS(pictureBlob);
    }

    if (deletedUser !== null) {
      return deletedUser;
    } else {
      throw new Error('User not found');
    }
  },
};
