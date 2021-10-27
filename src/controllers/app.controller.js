import debug from 'debug';
import { composeObject } from '@skeldon/sdv3-shared-library';
import { ApplicationError } from '../errors';
import appService from '../services/app.service';

const DEBUG = debug('dev');

export default {
  getAll: async (req, res) => {
    try {
      const filter = composeObject(req.query, ['q']);

      const resource = appService.findAll(filter);

      res.status(200).json({
        status: 'success',
        message: 'Resources successfully working',
        data: { resource },
      });
    } catch (error) {
      DEBUG(error);
      if (error instanceof ApplicationError) {
        throw new ApplicationError(500, error);
      }
    }
  },
  getOne: async (req, res) => {
    try {
      const resource = appService.findOne(req.params.id);

      res.status(200).json({
        status: 'success',
        message: 'Resource successfully working',
        data: { resource },
      });
    } catch (error) {
      DEBUG(error);
      if (error instanceof ApplicationError) {
        throw new ApplicationError(500, error);
      }
    }
  },
  update: async (req, res) => {
    try {
      const resource = appService.findOneAndUpdate(req.params.id, req.body);

      res.status(200).json({
        status: 'success',
        message: 'Resource successfully updated',
        data: { resource },
      });
    } catch (error) {
      DEBUG(error);
      if (error instanceof ApplicationError) {
        throw new ApplicationError(500, error);
      }
    }
  },
  deleteOne: async (req, res) => {
    try {
      const resource = appService.findOneAndDelete(req.params.id);

      res.status(200).json({
        status: 'success',
        message: 'Resource successfully deleted',
        data: { resource },
      });
    } catch (error) {
      DEBUG(error);
      if (error instanceof ApplicationError) {
        throw new ApplicationError(500, error);
      }
    }
  },
};
