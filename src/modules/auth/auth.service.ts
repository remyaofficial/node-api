import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import * as moment from 'moment-timezone';
import { CachingService } from '../../core/modules/caching/caching.service';
import { Job, JobResponse } from '../../core/utils/job';
import { User } from '../user/entities/user.entity';
import { OwnerDto } from '../../decorators/owner.decorator';
import { LoginLogService } from '../login-log/login-log.service';
import { LoginLog } from '../login-log/entities/login-log.schema';
import { TokenAuthDto } from './token/token-auth.dto';
import { UserService } from '../user/user.service';
import { generateHash, otp, uuid } from '../../core/utils/helpers';
import { MsClientService } from '../../core/modules/ms-client/ms-client.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

export interface AuthResponse {
  error?: any;
  user?: User;
}

@Injectable()
export class AuthService {
  constructor(
    private _jwt: JwtService,
    private _cache: CachingService,
    private userService: UserService,
    private loginLogService: LoginLogService,
    private msClient: MsClientService,
    private config: ConfigService,
    private usersService: UsersService,
  ) {}

  async createSession(owner: OwnerDto, info: any): Promise<any> {
    try {
      const refreshToken = randomBytes(40).toString('hex');
      const { error, data } = await this.loginLogService.create(
        new Job({
          owner,
          body: {
            token: refreshToken,
            user_id: owner.id,
            info,
          },
        }),
      );
      if (!!error) return { error };
      const token = this._jwt.sign({
        sessionId: data._id,
        userId: owner.id,
      });
      const tokenExpiry = moment().add(
        this.config.get('jwt')?.signOptions?.expiresIn,
        'seconds',
      );
      return {
        error: false,
        data: {
          token,
          token_expiry: tokenExpiry,
          refresh_token: refreshToken,
          user: owner,
          session_id: data._id,
        },
      };
    } catch (error) {
      return { error };
    }
  }

  async createUserSession(userId: number): Promise<any> {
    try {
      const { error, data } = await this.userService.findOneRecord(
        new Job({
          options: {
            where: { id: userId },
            allowEmpty: false,
          },
        }),
      );
      if (!!error) {
        return { error: 'Account does not exist' };
      } else {
        if (!data.active) {
          return { error: 'Account is inactive' };
        }
        const token = this._jwt.sign({
          sessionId: uuid(),
          userId,
        });
        const tokenExpiry = moment().add(
          this.config.get('jwt')?.signOptions?.expiresIn,
          'seconds',
        );
        return {
          error: false,
          data: { token, token_expiry: tokenExpiry, user: data },
        };
      }
    } catch (error) {
      return { error };
    }
  }

  async getNewToken(tokens: TokenAuthDto, session: LoginLog): Promise<any> {
    try {
      const decoded: any = await this._jwt.decode(tokens.token);
      if (
        decoded.sessionId !== String(session._id) ||
        decoded.userId !== session.user_id
      ) {
        return { error: 'Invalid token' };
      }
      const token = this._jwt.sign({
        sessionId: session._id,
        userId: session.user_id,
      });
      const tokenExpiry = moment().add(
        this.config.get('jwt')?.signOptions?.expiresIn,
        'seconds',
      );
      return {
        error: false,
        data: { token, token_expiry: tokenExpiry },
      };
    } catch (error) {
      return { error };
    }
  }

  async clearSession(owner: OwnerDto) {
    const { exp, sessionId } = owner;
    await this.loginLogService.update(
      new Job({
        id: sessionId,
        body: {
          logout_at: moment().toDate(),
          active: false,
        },
      }),
    );
    const authExp = new Date(exp * 1000);
    authExp.setHours(23, 59, 59, 999);
    const authRedisExpiry = (authExp.getTime() - new Date().getTime()) / 1000;
    const authKey = moment(authExp).format('DDMMYYYY');
    await this._cache.addToBlackList({
      expireAt: Math.floor(authRedisExpiry),
      key: authKey,
      sessionId,
    });
  }

  async verifyEmail(email: string): Promise<JobResponse> {
    const { error, data } = await this.userService.findOneRecord(
      new Job({
        options: {
          where: { email },
          allowEmpty: true,
        },
      }),
    );
    if (!!error) {
      return { error };
    } else if (!!data) {
      if (!data.active) {
        return { error: 'Account is inactive' };
      }
      return { error: false, data };
    } else {
      return { error: 'Invalid email' };
    }
  }

  async createUser(owner: OwnerDto, createUserDto: any): Promise<any> {
    try {
      // const refreshToken = randomBytes(40).toString('hex');
      const { error, data } = await this.usersService.create(
        new Job({
          owner,
          body: {
            name: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
          },
        }),
      );
      // if (!!error) return { error };
      // const token = this._jwt.sign({
      //   sessionId: data._id,
      //   userId: owner.id,
      // });
      // const tokenExpiry = moment().add(
      //   this.config.get('jwt')?.signOptions?.expiresIn,
      //   'seconds',
      // );
      // return {
      //   error: false,
      //   data: {
      //     token,
      //     token_expiry: tokenExpiry,
      //     refresh_token: refreshToken,
      //     user: owner,
      //     session_id: data._id,
      //   },
      // };
    } catch (error) {
      return { error };
    }
  }
}
