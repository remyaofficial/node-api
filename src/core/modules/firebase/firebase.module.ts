import { Module } from '@nestjs/common';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import firebaseConfig from '../../../config/firebase';

@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          load: [firebaseConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('firebase'),
    }),
  ],
  exports: [],
  providers: [],
})
export class FirebaseModule {}
