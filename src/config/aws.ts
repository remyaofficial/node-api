import { registerAs } from '@nestjs/config';
import { Credentials, SharedIniFileCredentials } from 'aws-sdk';
import { AwsServiceConfigurationOptionsFactory } from 'nest-aws-sdk';

export default registerAs('aws', () => {
  const config: AwsServiceConfigurationOptionsFactory = {
    region: process.env.AWS_REGION || 'us-east-1',
  };
  if (!!process.env.AWS_USE_SHARED_CREDENTIAL) {
    config.credentials = new SharedIniFileCredentials({
      profile: process.env.AWS_PROFILE || 'default',
    });
  } else {
    config.credentials = new Credentials({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
  return config;
});
