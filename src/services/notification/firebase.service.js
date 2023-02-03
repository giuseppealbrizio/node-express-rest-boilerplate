import { getMessaging } from 'firebase-admin/messaging';
import { ApplicationError } from '../../errors';

/**
 *
 * @param messageObject {object}
 * @param messageObject.title {string}
 * @param messageObject.body {string}
 * @param userFirebaseToken
 * @return {Promise<{response: string, message: string}>}
 */
export const sendFirebaseNotificationToSingleUser = async (
  messageObject,
  userFirebaseToken,
) => {
  const message = {
    data: {
      title: messageObject.title,
      body: messageObject.body,
    },
    token: userFirebaseToken,
  };
  try {
    const response = await getMessaging().send(message);
    // console.log('Successfully sent message:', response);
    return { message: 'Successfully sent message', response };
  } catch (error) {
    // console.log('Error sending message:', error);
    throw new ApplicationError(404, `${error.message} | Code: ${error.code}`);
  }
};

/**
 *
 * @param messageObject {object}
 * @param usersFirebaseTokens
 * @param messageObject.title {string}
 * @param messageObject.body {string}
 * @return {Promise<{response: BatchResponse, message: string, failedTokens: *[], status: string}>}
 */
export const sendFirebaseNotificationToMultipleUsers = async (
  messageObject,
  usersFirebaseTokens, // this is an array of tokens
) => {
  const message = {
    data: {
      title: messageObject.title,
      body: messageObject.body,
    },
    tokens: usersFirebaseTokens,
  };
  try {
    const response = await getMessaging().sendMulticast(message);
    // console.log('Successfully sent message:', response);

    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(usersFirebaseTokens[idx]);
        }
      });
      // console.log(`List of tokens that caused failures: ${failedTokens}`);
      return {
        status: 'incomplete',
        message: 'Successfully sent message to some users. Check details',
        response,
        failedTokens,
      };
    }
    return {
      status: 'success',
      message: 'Successfully stored messages and sent FCM notification',
      response,
      failedTokens: [],
    };
  } catch (error) {
    // console.log('Error sending message:', error);
    throw new ApplicationError(404, `${error.message} | Code: ${error.code}`);
  }
};
