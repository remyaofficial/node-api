import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MsClientService } from './ms-client.service';
import msConfig from '../../../config/ms';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JobLog, JobLogSchema } from '../mongo/schemas/job-log.schema';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WORKER_SERVICE',
        imports: [
          ConfigModule.forRoot({
            load: [msConfig],
          }),
        ],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => config.get('ms'),
      },
    ]),
    MongooseModule.forFeature([{ name: JobLog.name, schema: JobLogSchema }]),
  ],
  providers: [MsClientService],
  exports: [MsClientService],
})
export class MsClientModule {}
