import { Module } from '@nestjs/common';
import { MsClientModule } from '../../ms-client/ms-client.module';
import { FirebaseModule } from '../firebase.module';
import { FirebaseNotificationController } from './firebase-notification.controller';
import { FirebaseNotificationService } from './firebase-notification.service';

@Module({
  imports: [FirebaseModule, MsClientModule],
  controllers: [FirebaseNotificationController],
  providers: [FirebaseNotificationService],
  exports: [FirebaseNotificationService],
})
export class FirebaseNotificationModule {}
