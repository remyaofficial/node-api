import { Module } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { FirebaseAuthController } from './firebase-auth.controller';
import { FirebaseAuthService } from './firebase-auth.service';
import { AuthModule } from '../auth.module';
import { FireAuthModule } from '../../../core/modules/firebase/auth/fire-auth.module';
import { FirebaseStrategy } from './firebase.strategy';
import { FirebaseJwtStrategy } from '../firebase-jwt/firebase-jwt.strategy';

@Module({
  imports: [FireAuthModule, UserModule, AuthModule],
  providers: [FirebaseAuthService, FirebaseStrategy, FirebaseJwtStrategy],
  controllers: [FirebaseAuthController],
})
export class FirebaseAuthModule {}
