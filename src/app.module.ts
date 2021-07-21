import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config';
import { CachingModule } from './core/modules/caching/caching.module';
import { DatabaseModule } from './core/modules/database/database.module';
import { StaticPathModule } from './core/modules/static-path/static-path.module';
import { HealthModule } from './core/modules/health/health.module';
import { MongoModule } from './core/modules/mongo/mongo.module';
import { MsClientModule } from './core/modules/ms-client/ms-client.module';
import { SeederModule } from './core/modules/seeder/seeder.module';
import { SessionModule } from './core/modules/session/session.module';
import { JwtAuthGuard } from './modules/auth/jwt/jwt-auth.guard';
// import { FirebaseJwtAuthGuard } from './modules/auth/firebase-jwt/firebase-jwt-auth.guard';
import { RolesGuard } from './modules/auth/roles.guard';
import { QueryGuard } from './core/guards/query.guard';
import { SocketModule } from './core/modules/socket/socket.module';
import { AppGateway } from './app.gateway';

import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocalAuthModule } from './modules/auth/local/local-auth.module';
import { UsersModule } from './modules/users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    CachingModule,
    ScheduleModule.forRoot(),
    StaticPathModule,
    DatabaseModule,
    MongoModule,
    SeederModule,
    MsClientModule,
    HealthModule,
    SessionModule,
    SocketModule,    
    AuthModule,
    LocalAuthModule,    
    UserModule, UsersModule,

  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    
    {
      provide: APP_GUARD,
      useClass: QueryGuard,
    },
  ],
})
export class AppModule {}
