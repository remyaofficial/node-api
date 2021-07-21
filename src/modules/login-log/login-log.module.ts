import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginLog, LoginLogSchema } from './entities/login-log.schema';
import { LoginLogService } from './login-log.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoginLog.name, schema: LoginLogSchema },
    ]),
  ],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
