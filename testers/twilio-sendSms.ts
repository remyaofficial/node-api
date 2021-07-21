import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { TwilioModule } from 'src/core/modules/twilio/twilio.module';
import { TwilioService } from 'src/core/modules/twilio/twilio.service';
import { Job } from 'src/core/utils/job';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const twilio = app.select(TwilioModule).get(TwilioService);
    const response = await twilio.sendSMS(
      new Job({
        payload: {
          body: 'test sms',
          to: '+917736520877',
        },
      }),
    );
    console.log(response);
    await app.close();
    process.exit(0);
  } catch (error) {}
}
bootstrap();
