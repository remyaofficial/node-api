import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { AwsModule } from 'src/core/modules/aws/aws.module';
import { S3Service } from 'src/core/modules/aws/s3/s3.service';
import { Job } from 'src/core/utils/job';

//https://whipflipnow.s3.amazonaws.com/prospects/10443/odometer.jpg

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const s3 = app.select(AwsModule).get(S3Service);

    const { error, data } = await s3.getSignedURL(
      new Job({
        payload: {
          bucket: 'whipflipnow',
          key: '/prospects/10443/odometer.jpg',
        },
      }),
    );
    if (error) console.log(error);
    console.log(data);
    await app.close();
    process.exit(0);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
