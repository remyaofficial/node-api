import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { Job } from '../../../core/utils/job';
import { FireAuthService } from '../../../core/modules/firebase/auth/fire-auth.service';

@Injectable()
export class FirebaseJwtStrategy extends PassportStrategy(
  Strategy,
  'firebase-jwt',
) {
  constructor(
    private userService: UserService,
    private fireAuthService: FireAuthService,
  ) {
    super();
  }

  async validate(request: any) {
    try {
      if (
        !request.headers.authorization ||
        request.headers.authorization.split(' ')[0] !== 'Bearer'
      ) {
        throw new UnauthorizedException('Missing idToken');
      }
      const { error: validateError, data: session } =
        await this.fireAuthService.verifyIdToken(
          new Job({
            payload: {
              idToken: request.headers.authorization.split(' ')[1],
            },
          }),
        );
      if (!!validateError) {
        throw new UnauthorizedException('Invalid idToken');
      }
      const { error, data } = await this.userService.findOneRecord(
        new Job({
          options: {
            where: {
              firebase_id: session.uid,
            },
            allowEmpty: true,
          },
        }),
      );
      if (!!error || !data || !data.active) return false;
      return { ...data.toJSON() };
    } catch (error) {
      return false;
    }
  }
}
