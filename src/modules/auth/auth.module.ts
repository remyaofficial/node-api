import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionModule } from '../../core/modules/session/session.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CachingModule } from '../../core/modules/caching/caching.module';
import { CachingService } from '../../core/modules/caching/caching.service';
import { LoginLogModule } from '../login-log/login-log.module';
import { UserModule } from '../user/user.module';
import { TokenStrategy } from './token/token.strategy';
import { MsClientModule } from '../../core/modules/ms-client/ms-client.module';
import { RecaptchaModule } from '../../core/modules/recaptcha/recaptcha.module';
import { RecaptchaStrategy } from './recaptcha/recaptcha.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    CachingModule,
    SessionModule,
    LoginLogModule,
    UserModule,
    MsClientModule,
    RecaptchaModule,
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    TokenStrategy,
    RecaptchaStrategy,
    CachingService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
