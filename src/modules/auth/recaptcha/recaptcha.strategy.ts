import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RecaptchaService } from '../../../core/modules/recaptcha/recaptcha.service';
import { Job } from '../../../core/utils/job';

@Injectable()
export class RecaptchaStrategy extends PassportStrategy(Strategy, 'recaptcha') {
  constructor(private recaptchaService: RecaptchaService) {
    super();
  }

  async validate(request: any) {
    try {
      const { error, data } = await this.recaptchaService.verify(
        new Job({
          payload: {
            response: request.headers.recaptcha,
          },
        }),
      );
      if (!!error || !data.success) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
