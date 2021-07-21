import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthService } from './firebase-auth.service';
import { FireAuthService } from '../../../core/modules/firebase/auth/fire-auth.service';
import { Job } from '../../../core/utils/job';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  'firebase-login',
) {
  constructor(
    private fireAuthService: FireAuthService,
    private authService: FirebaseAuthService,
  ) {
    super();
  }

  async validate(request: Request, done): Promise<any> {
    const { error: validateError, data: session } =
      await this.fireAuthService.verifyIdToken(
        new Job({
          payload: {
            idToken: request.body.token,
            checkRevoked: true,
          },
        }),
      );
    if (!!validateError) {
      throw new UnauthorizedException('Invalid idToken');
    }
    const { error, user } = await this.authService.validateFirebaseUser(
      session,
      request,
    );
    if (!!error) {
      throw error;
    }
    done(null, user);
  }
}
