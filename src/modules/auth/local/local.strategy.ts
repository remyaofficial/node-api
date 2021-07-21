import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LocalAuthService } from './local-auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: LocalAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const { error, user } = await this.authService.validateUser(
      username,
      password,
    );
    if (!!error) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
