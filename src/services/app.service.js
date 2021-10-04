import cleanDeep from 'clean-deep';
import { ApplicationError } from '../helpers/errors.helper';

export default {
  findAll: async (filter) => {
    const cleanedObject = cleanDeep(filter);

    return `This service should return all resources and an object ${cleanedObject}`;
  },
  findOne: async (id) => {
    if (id === 0) {
      throw new ApplicationError(401, `${id} should not be equal to 0`);
    }
    return `This service should return ${id} resource`;
  },
  findOneAndUpdate: async (id, body) => {
    return `This service should update ${id} resource with this body ${body}`;
  },
  findOneAndDelete: async (id) => {
    return `This service should delete ${id} resource `;
  },
};
