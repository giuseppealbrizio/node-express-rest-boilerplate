import { PubSub } from '@google-cloud/pubsub';
import debug from 'debug';
import { ApplicationError } from '../../helpers/errors.helper';

const DEBUG = debug('dev');

// Creates a Pub/Sub client; cache this for further use
const pubSubClient = new PubSub();

/**
 * PUSH EVENTS SUBSCRIBER
 */
/**
 * Example of subscription to push event
 * @param req
 * @param res
 * @return {Promise<*>}
 */
export const subscribeToPushEventExample = async (req, res) => {
  try {
    // Await for message coming from Pub/Sub in a push notification.
    const data = Buffer.from(req.body.message.data, 'base64').toString('utf-8');

    const result = await JSON.parse(data);

    // const foundUser = await UserService.findUserById(messageResponse.userId);
    // console.log(`${foundUser?.username} ha appena mandato una richiesta`);

    console.log('Push event contains this object: ', result);

    res.status(200).send();
  } catch (error) {
    DEBUG(error);
    throw new ApplicationError(500, "Couldn't receive orders object :(", error);
  }
};

/**
 * PULL EVENTS SUBSCRIBER
 */
/**
 * Example of subscription to pull event
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export const subscribeToPullEventExample = async (req, res) => {
  try {
    // Define some options for subscription
    const subscriberOptions = {
      flowControl: {
        maxMessages: 10,
      },
    };

    // References an existing subscription
    const subscription = await pubSubClient.subscription(
      'subscription-name',
      subscriberOptions,
    );

    // Instantiate the message counter
    let messageCount = 0;

    // Create an event handler to handle messages
    const messageHandler = async (message) => {
      // Buffering the message data
      const data = Buffer.from(message.data, 'base64').toString('utf-8');

      // Parse message in a JSON Object
      const result = JSON.parse(data);

      // Do something with the result
      console.log(result);

      // Increase message counter
      messageCount += 1;

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Create an event handler to handle errors
    const errorHandler = function (error) {
      throw new Error(error);
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    // Listen for errors
    subscription.on('error', errorHandler);

    // Set the timeout to 60 seconds
    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      subscription.removeListener('error', errorHandler);
      console.log(`${messageCount} message(s) received.`);
    }, 60 * 1000);

    // Send a 200 status code
    res.status(200).send();
  } catch (error) {
    DEBUG(error);
    throw new ApplicationError(500, "Couldn't receive orders object :(", error);
  }
};
