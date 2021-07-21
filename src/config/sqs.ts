import { registerAs } from '@nestjs/config';

export default registerAs('sqs', () => ({
  QueueOwnerAWSAccountId: process.env.AWS_SQS_ACCOUNT_ID || undefined,
}));
