import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../../user/user.module';
import { AuthModule } from '../auth.module';
import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [UserModule, AuthModule, UsersModule],
  providers: [LocalAuthService, LocalStrategy],
  controllers: [LocalAuthController],
})
export class LocalAuthModule {}
