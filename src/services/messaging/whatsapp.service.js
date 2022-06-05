import { Twilio } from 'twilio';
import initMB from 'messagebird';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const companyNumber = process.env.TWILIO_PHONE_NUMBER;

/**
 *
 * @param toNumber
 * @returns {Promise<*>}
 */
export const sendWhatsappMessage = async (toNumber) => {
  try {
    const client = new Twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: `You can use only registered template on Twilio`,
      from: `whatsapp:${companyNumber}`,
      to: `whatsapp:${toNumber}`,
    });

    if (message.sid) {
      return {
        success: true,
        message: 'Message sent successfully',
        response: message,
      };
    }

    return message;
  } catch (error) {
    return error;
  }
};

/**
 * Send a whatsapp message through messagebird
 * @returns {Promise<*>}
 */
export const sendWhatsappMessageWithMessagebird = () => {
  const {
    MESSAGEBIRD_ACCESS_KEY,
    MESSAGEBIRD_WHATSAPP_CHANNEL_ID,
    MESSAGEBIRD_TEMPLATE_NAMESPACE_ID,
  } = process.env;

  const messagebird = initMB(MESSAGEBIRD_ACCESS_KEY);

  const params = {
    to: '+31XXXXXXXXXXX',
    from: MESSAGEBIRD_WHATSAPP_CHANNEL_ID,
    type: 'hsm',
    content: {
      hsm: {
        namespace: MESSAGEBIRD_TEMPLATE_NAMESPACE_ID,
        templateName: 'your-template-name',
        language: {
          code: 'en',
        },
        components: [
          {
            type: 'body',
            parameters: [{ type: 'text', text: 'your-variable' }],
          },
        ],
      },
    },
  };

  messagebird.conversations.send(params, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
  });
};
