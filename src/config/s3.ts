import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  signatureVersion: 'v4',
  params: {
    Bucket: process.env.AWS_S3_BUCKET,
  },
}));
