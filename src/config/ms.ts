import { registerAs } from '@nestjs/config';
import { ClientProvider, Transport } from '@nestjs/microservices';

/* Micro service config */
export default registerAs(
  'ms',
  (): ClientProvider => ({
    transport: Transport.REDIS,
    options: {
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${
        parseInt(process.env.REDIS_PORT, 10) || 6379
      }`,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  }),
);
