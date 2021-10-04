import { publishMessage } from '@skeldon/sdv3-shared-library';
import { PubSub } from '@google-cloud/pubsub';
import debug from 'debug';
import { ApplicationError } from '../../helpers/errors.helper';

const DEBUG = debug('dev');

const pubSubClient = new PubSub();

/**
 * This controller publish the ticket created event
 * @return {Promise<any>}
 * @param body
 */
export const publishEventExample = async (body) => {
  try {
    return await publishMessage(
      pubSubClient,
      'topic-name', // topic name
      body,
    );
  } catch (error) {
    DEBUG(error);
    throw new ApplicationError(500, error.message);
  }
};
