import SparkPost from 'sparkpost';
import { ApplicationError } from '../../errors';

export default {
  /**
   * Send a message with a token to user requesting a password reset.
   * @param email
   * @param token
   * @returns {Promise<*>}
   */
  sendTestEmail: async (email, token) => {
    const { SPARKPOST_API_KEY, SPARKPOST_SENDER_DOMAIN } = process.env;

    try {
      const euClient = new SparkPost(SPARKPOST_API_KEY, {
        origin: 'https://api.eu.sparkpost.com:443',
      });

      const transmission = {
        recipients: [
          {
            address: {
              email,
              name: email,
            },
          },
        ],
        content: {
          from: {
            email: `support@${SPARKPOST_SENDER_DOMAIN}`,
            name: 'Support Email',
          },
          subject: 'Reset your password',
          reply_to: `support@${SPARKPOST_SENDER_DOMAIN}`,
          text: `Hello ${email}, this a test. It works if you see this token: ${token}`,
        },
      };

      return await euClient.transmissions.send(transmission);
    } catch (error) {
      throw new ApplicationError(400, error, error.message);
    }
  },
};
