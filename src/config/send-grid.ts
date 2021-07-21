import { registerAs } from '@nestjs/config';
import { SendGridModuleOptions } from '@ntegral/nestjs-sendgrid';

export default registerAs(
  'send-grid',
  (): SendGridModuleOptions => ({
    apiKey: process.env.SENDGRID_API_KEY,
    defaultMailData: {
      text: '',
      from: { name: 'Admin', email: 'admin@admin.com' },
    },
  }),
);
