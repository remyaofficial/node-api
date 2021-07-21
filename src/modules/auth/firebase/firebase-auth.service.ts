import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Job } from '../../../core/utils/job';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';

export interface AuthResponse {
  error?: any;
  user?: User;
}

@Injectable()
export class FirebaseAuthService {
  constructor(private _user: UserService) {}

  async validateFirebaseUser(
    session: any,
    request: Request,
  ): Promise<AuthResponse> {
    let user;
    const { error: findError, data: findUser } = await this._user.findOneRecord(
      new Job({
        options: {
          where: { firebase_id: session.uid },
          allowEmpty: true,
        },
      }),
    );
    if (!!findError) {
      return { error: findError };
    }
    if (!!findUser) user = findUser;
    else {
      const email = session.email || request.body.email;
      const name = session.name || '';
      const nameArray = name.split(' ');
      const { error, data } = await this._user.findOrCreate(
        new Job({
          body: {
            first_name: nameArray[0],
            last_name: nameArray.slice(1).join(' '),
            email,
            provider: 'Firebase',
            firebase_id: session.uid,
          },
          options: {
            where: { email },
          },
        }),
      );
      if (!!error) {
        return { error };
      }
      user = data;
    }
    if (!user.active) {
      return { error: 'Account is inactive' };
    }
    user.firebase_id = session.uid;
    user.last_login_at = Date.now();
    await user.save();
    return { error: false, user };
  }
}
