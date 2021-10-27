import cleanDeep from 'clean-deep';
import { ApplicationError } from '../errors/old/errors.helper';
import App from '../models/app.model';

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
  findOneAndSoftDelete: async (id) => {
    const app = await App.findOne({ id });

    if (app) {
      await app.delete();
    }

    return `The object is soft deleted ${app}`;
  },
  findOneAndDelete: async (id) => {
    return `This service should delete ${id} resource `;
  },
};
