// Controller created for testing purposes
import debug from 'debug';
import { ApplicationError } from '../errors';
import { sendWhatsappMessageWithMessagebird } from '../services/messaging/whatsapp.service';

const DEBUG = debug('dev');

export default {
  /**
   * Test controller - Protected router test
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  checkRouteProtection: async (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Yes you are authenticated and the test is completed',
      },
    });
  },
  /**
   * Test controller - This is a test controller to retrieve the user logged
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  checkUserLogged: async (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        message: 'User logged retrieved',
        userInPassport: req?.user,
        userInSession: req?.session,
        userInCustomMiddleware: req.currentUser,
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },
  /**
   * Test controller - This is a test controller to send a whatsapp message
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  sendWhatsappWelcomeMessage: async (req, res) => {
    try {
      await sendWhatsappMessageWithMessagebird();

      res.status(200).json({
        status: 'success',
        message: 'Whatsapp welcome message sent',
      });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(error.statusCode, error.message);
    }
  },
};
