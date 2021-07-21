import { registerAs } from '@nestjs/config';
import { FirebaseAdminModuleOptions } from '@aginix/nestjs-firebase-admin';
import { credential } from 'firebase-admin';
import { resolve } from 'path';

export default registerAs(
  'firebase',
  (): FirebaseAdminModuleOptions => ({
    credential: !!process.env.FIREBASE_KEY_PATH
      ? // eslint-disable-next-line @typescript-eslint/no-var-requires
        credential.cert(require(resolve(process.env.FIREBASE_KEY_PATH)))
      : credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    serviceAccountId: process.env.FIREBASE_SERVICE_ACCOUNT_ID,
  }),
);
