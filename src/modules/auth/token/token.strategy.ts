import { Strategy } from 'passport-auth-token';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Job } from '../../../core/utils/job';
import { LoginLogService } from '../../login-log/login-log.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    private loginLogService: LoginLogService,
    private userService: UserService,
  ) {
    super({
      tokenFields: ['refresh_token'],
    });
  }

  async validate(token, done) {
    try {
      const { error, data } = await this.loginLogService.findOneRecord(
        new Job({
          options: {
            where: { token, active: true },
          },
        }),
      );
      if (!!error || !data) throw new UnauthorizedException();
      const { error: userError, data: userData } =
        await this.userService.findRecordById(
          new Job({
            id: data.user_id,
            options: {
              allowEmpty: true,
            },
          }),
        );
      if (!!userError || !userData || !userData.active)
        throw new UnauthorizedException();
      done(null, data);
    } catch (error) {
      done(error);
    }
  }
}
