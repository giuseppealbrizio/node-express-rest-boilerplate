import MailService from '@sendgrid/mail';
import { ApplicationError } from '../../errors';

const templates = {
  template_1: 'id_of_template',
};

export default {
  /**
   * Send a test email
   * @return {Promise<[Response<object>, {}]>}
   */
  sendTestEmail: async () => {
    try {
      MailService.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: process.env.SENDGRID_SENDER_EMAIL,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'This is a test email from service',
        text: 'This is a test email from service',
      };
      return await MailService.send(msg);
    } catch (error) {
      if (error.response) {
        throw new ApplicationError(error.code, error.response.body);
      }
    }
  },
  /**
   * Send an email with dynamic template created on sendgrid
   * @param data
   * @return {Promise<[Response<object>, {}]>}
   */
  sendEmailWithDynamicTemplate: async (data) => {
    const { fromEmail, toEmail, toCCEmails, templateName, dtField } = data;
    try {
      MailService.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        // from: process.env.SENDGRID_SENDER_EMAIL,
        from: fromEmail,
        to: toEmail,
        cc: toCCEmails,
        subject: 'Subject of the email',
        templateId: templates[templateName],
        dynamic_template_data: {
          dt_field_1: dtField,
        },
      };
      return await MailService.send(msg);
    } catch (error) {
      if (error.response) {
        throw new ApplicationError(error.code, error.response.body);
      }
    }
  },
};

// const array = [];
// const emailList = _.uniq([array[0].model1.email, array[0].model2.email]);
//
// const emailData = {
//   fromEmail: 'mail@mail.com',
//   toEmail: emailList.shift(), // return the first element of the array
//   toCCEmails: emailList, // return the cleaned array of email
//   templateName: 'template_name',
//   array,
//   employeeName: array[0].model1.name,
//   employeeEmail: array[0].model1.email,
//   clientName: array[0].model2.name,
//   clientEmail: array[0].model2.email,
// };
//
// const email = await EmailService.sendEmailWithDynamicTemplate(emailData);
