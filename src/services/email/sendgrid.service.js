import MailService from '@sendgrid/mail';
import { ApplicationError } from '../../helpers/errors.helper';

export default {
  sendTestEmail: async () => {
    try {
      MailService.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: process.env.SENDGRID_SENDER_EMAIL,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'This is a test email from upload service',
        text: 'This is a test email from upload service',
      };
      return await MailService.send(msg);
    } catch (error) {
      throw new ApplicationError(400, error, error.message);
    }
  },
};
