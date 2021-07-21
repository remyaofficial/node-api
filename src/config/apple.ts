import { registerAs } from '@nestjs/config';

export default registerAs('apple', () => ({
  clientID: process.env.APPLE_CLIENT_ID,
  passReqToCallback: false,
}));
