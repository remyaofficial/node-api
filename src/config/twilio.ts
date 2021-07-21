import { registerAs } from '@nestjs/config';
import { TwilioModuleOptions } from 'nestjs-twilio';

export default registerAs(
  'twilio',
  (): TwilioModuleOptions & {
    from?: string;
  } => ({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER,
  }),
);
