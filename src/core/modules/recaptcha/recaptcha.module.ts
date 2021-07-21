import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import recaptchaConfig from '../../../config/recaptcha';
import { RecaptchaService } from './recaptcha.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [recaptchaConfig],
    }),
  ],
  providers: [RecaptchaService],
  exports: [RecaptchaService],
})
export class RecaptchaModule {}
