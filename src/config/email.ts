import { registerAs } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

export default registerAs(
  'email',
  (): MailerOptions => ({
    transport: '',
    defaults: {
      from: '"Newage SMB" <admin@amin.com>',
    },
  }),
);
